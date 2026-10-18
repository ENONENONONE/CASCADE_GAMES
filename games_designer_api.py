#!/usr/bin/env python3
"""games_designer_api.py — the games-designer-code-agent through the Claude API.

The agent's instructions are the body of ~/.claude/agents/games-designer-code-agent.md (the same file Claude Code and the
Agent SDK load as a subagent). This script sends them as the system prompt, attaches the files you name as context, and
streams the answer: a design paragraph and the code to write. The answer goes to stdout (and --out); the summary of the
model's thinking goes to stderr. It does not edit files itself; for an agent that reads, edits and runs tests on its own,
use the subagent in Claude Code or the Claude Agent SDK.

    pip install -r requirements.txt
    python3 games_designer_api.py "add a night sky mode to THE FOLD" cascade_ar/index.html cascade_ar/ar.js
    python3 games_designer_api.py --out answer.md "review game.js for bugs" cascade_ar/game.js

Credentials: ANTHROPIC_API_KEY, or an `ant auth login` profile.
"""
import argparse
import os
import pathlib
import sys

import anthropic

AGENT = pathlib.Path(os.path.expanduser("~/.claude/agents/games-designer-code-agent.md"))
MODEL = "claude-opus-5-5"
MAX_FILE_BYTES = 400_000   # a file larger than this is refused, not cut


def agent_prompt() -> str:
    text = AGENT.read_text(encoding="utf-8")
    if text.startswith("---"):
        text = text.split("---", 2)[2]   # drop the frontmatter; the body is the system prompt
    return text.strip() + "\n\nYou are called through the API without tools: answer with the design paragraph, then every file change as a complete code block naming its path, then the tests to run."


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("task", help="what to design, build or review")
    ap.add_argument("files", nargs="*", help="files to give the agent as context")
    ap.add_argument("--effort", default="high", choices=["low", "medium", "high", "xhigh", "max"])
    ap.add_argument("--out", help="also write the answer to this file")
    a = ap.parse_args()

    if not AGENT.is_file():
        print(f"{AGENT} not found; the agent's instructions are read from there", file=sys.stderr)
        return 2
    parts = []
    for f in a.files:
        p = pathlib.Path(f)
        if not p.is_file():
            print(f"{f}: no such file", file=sys.stderr)
            return 2
        data = p.read_bytes()
        if len(data) > MAX_FILE_BYTES:
            print(f"{f} is {len(data)} bytes, over {MAX_FILE_BYTES}; name a smaller file or split it", file=sys.stderr)
            return 2
        parts.append(f'<file path="{p}">\n{data.decode("utf-8", "replace")}\n</file>')
    content = ("\n\n".join(parts) + "\n\n" if parts else "") + a.task

    client = anthropic.Anthropic()
    out = []
    thought = False
    try:
        with client.beta.messages.stream(
            model=MODEL,
            max_tokens=64000,
            betas=["server-side-fallback-2026-07-01"],
            fallbacks="default",                      # a declined request is re-run server-side on the recommended model
            thinking={"type": "adaptive", "display": "summarized"},
            output_config={"effort": a.effort},
            system=[{"type": "text", "text": agent_prompt(), "cache_control": {"type": "ephemeral"}}],
            messages=[{"role": "user", "content": content}],
        ) as stream:
            for event in stream:
                if event.type == "content_block_delta" and event.delta.type == "text_delta":
                    sys.stdout.write(event.delta.text); sys.stdout.flush(); out.append(event.delta.text)
                elif event.type == "content_block_delta" and event.delta.type == "thinking_delta":
                    sys.stderr.write(event.delta.thinking); sys.stderr.flush(); thought = True
                elif event.type == "content_block_start" and event.content_block.type == "text" and thought:
                    sys.stderr.write("\n\n"); sys.stderr.flush(); thought = False   # keep the answer off the thinking's last line
            msg = stream.get_final_message()
    except anthropic.RateLimitError as e:
        print(f"\nrate limited: {e.message}", file=sys.stderr); return 3
    except anthropic.APIStatusError as e:
        print(f"\nAPI error {e.status_code}: {e.message}", file=sys.stderr); return 3
    except anthropic.APIConnectionError:
        print("\nnetwork error", file=sys.stderr); return 3

    if msg.stop_reason == "refusal":
        cat = msg.stop_details.category if msg.stop_details else None
        print(f"\nthe request was declined ({cat})", file=sys.stderr); return 4
    if msg.stop_reason == "max_tokens":
        print("\nthe answer hit max_tokens and is incomplete", file=sys.stderr)
    print(f"\n\n[{msg.model} · in {msg.usage.input_tokens} · out {msg.usage.output_tokens} · cache read {msg.usage.cache_read_input_tokens}]", file=sys.stderr)
    if a.out:
        pathlib.Path(a.out).write_text("".join(out), encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())

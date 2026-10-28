#!/bin/bash
# Gives the canvora CLI the API key saved in this plugin's settings (/plugin configure canvora@canvora).
# The key stays in Claude Code's secure storage; this only exports it for this session's shell commands.
if [ -n "$CLAUDE_PLUGIN_OPTION_API_KEY" ] && [ -n "$CLAUDE_ENV_FILE" ]; then
  printf 'export CANVORA_API_KEY=%q\n' "$CLAUDE_PLUGIN_OPTION_API_KEY" >> "$CLAUDE_ENV_FILE"
fi
exit 0

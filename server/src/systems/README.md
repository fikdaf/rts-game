# Server systems

Gameplay simulation is split into small authoritative systems:

- `CommandSystem`: validates and applies player commands.
- `MovementSystem`: advances units toward targets.
- `CombatSystem`: owns combat/death checks and is the extension point for attacks.

Keep rules that affect game state on the server. The client should only render state and send intent.

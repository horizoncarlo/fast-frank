# While Developing
- Scaled original Blueman to 25% across the board, by hand
- Scaled items/* images to 50px width as a max, by hand. Some were lower if their height was super big, like Beer

# Original Notes
**"Fast Frankenstein"**, drag limbs into preset combinations, as fast as possible. Some obstacles or setbacks are possible. Use same random seed to compete against friends

Could have a rotate button held to spin limb via css, and they can start randomly spun. Gradient to determine which way is up

How to drag accurately enough when image is a square for detection...SVG? or canvas and can it detect transparent to ignore?

At the end scores are optionally sent to a ntfy.sh channel, that coworkers can subscribe to, then it say stuff like "Jerry just completed a round in 5.6 seconds. Random seed was 28312983" so they can replicate and compete.

For random seeds have the concept of a "daily seed" that generates from the date, maybe Month then day * year, all lowercase? So "mar20260" for March 10th, 2026.

Consider each piece of the body has a chance for custom modifiers. For example, one might start ticking down like a bomb, so you have to switch to it rapidly or 1 of them might start to grow or shrink or teleport.

Leverage Neodrag

Gives us grid snapping, plus small exact drag handles (like the eyes of blueman) for further mutations

Set max window size to be fair and consistent between monitors

Supastate https://www.npmjs.com/package/supastate for light state

# What is Left
- TODO ntfy.sh on game win/loss
- TODO Terrain and obstacle generation - different types, locations, maybe positive effects?, etc. Moving obstacles too
  - **This is key** the idea is there are different choices and paths, there should be SOME level of strategy / difference between players on how they approach a map
- TODO Limb modifications and mutators - bomb (countdown then explode, minus point, reposition), shrunken (need to spend time mousing over to grow before dragging?), rotated (q/e to rotate before dragging?), teleport (randomly jumps around screen)
- TODO For tracking score consider details like "worst offset" and "average time" (which is tracked as dragStart to successful dragEnd)
- TODO Config and Setup options: Name, Background gradient 1 & 2, Map Size, Item/Wall count?. Store some of these in local storage as well
  - Have this as an initial screen before the map, then you press "go". Overlay the countdown over the map in that case. Or just remove the countdown, and have it start on first drag
- TODO What about a "mask" you get from https://kenney.nl/assets/animal-pack-remastered over the head that...SOMEHOW...drastically changes the game?
  - Not very realistic on our timeline

# Before Demo #TTODO
- ntfy integration
- add gugs.dev link to README
- another movement type shouldn't be hard, just per item and skip if we're the attacking one
- go back to array of status messages. Clear oldest (first item) after X seconds. Add utility to add message. Add message when stuff wears off too, like current Unfrozen
- TBD show last X scores via local storage per seed. Show only at end screen, with a timestamp for each one
- TBD test set seeds, do letters even work?

# Positive/Negative Effects and Items
Negative Effects:
X- Time penalty on hit
X- Teleport current limb randomly
X- Freeze limb (can't be dragged for X seconds)
- Slow drag
- Super fast drag
- Offset drag, like "confusion", need to modify position directly onDrag or something?
- Slide a random direction (too much like teleport?)
- Straight up do a dragEnd so you have to click to drag again?
X- Map level visual effects: flashbang/blind, smoke, blackout, blood spatters
- Fight something, like a rat dragging the limb, need to click it a bunch of times?
- Banker or something, spawns a coin, need to drag coin to them to pay them off to free limb
- QTE to unlock limb: enter key combo or type word, do a "reload" animation style, spam A/D ("joystick wiggle") to free, spawn dots that need to be clicked rapidly across the screen

Positive Effects:
X- Time bonus
- Automatic limb locking with Perfect placement
- Immunity to anything for a bit
X- Undo last limb (clickable, don't drag anything onto)

Moving Style:
- Stationary
- Left to Right
- Top to Bottom
- X Attracted or repelled to current dragged limb
- Random entirely
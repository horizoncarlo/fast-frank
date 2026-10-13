# While Developing
- Scaled original Blue Man to 25% across the board, by hand

# Original Notes
**"Fast Frankenstein"**, drag limbs into preset combinations, as fast as possible. Some obstacles or setbacks are possible. Use same random seed to compete against friends

Could have a rotate button held to spin limb via css, and they can start randomly spun. Gradient to determine which way is up

How to drag accurately enough when image is a square for detection...SVG? or canvas and can it detect transparent to ignore?

At the end scores are optionally sent to a ntfy.sh channel, that coworkers can subscribe to, then it say stuff like "Jerry just completed a round in 5.6 seconds. Random seed was 28312983" so they can replicate and compete.

For random seeds have the concept of a "daily seed" that generates from the date, maybe Month then day * year, all lowercase? So "mar20260" for March 10th, 2026.

Consider each piece of the body has a chance for custom modifiers. For example, one might start ticking down like a bomb, so you have to switch to it rapidly or 1 of them might start to grow or shrink or teleport.

Leverage Neodrag

Gives us grid snapping, plus small exact drag handles (like the eyes of blue man) for further mutations

Set max window size to be fair and consistent between monitors

Supastate https://www.npmjs.com/package/supastate for light state
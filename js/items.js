const wallItem = { name: "wall", isWall: true };

window.items = {
  all: [], // element, boundingRect (set later as a cache), onHit (func)
  // TODO More and more items
  available: [
    wallItem,
    { name: "time-penalty", title: "5-10 second time penalty. Stop for a beer!", onHit: onHitTimePenalty },
    { name: "time-bonus", title: "3-5 second time bonus. Get caffeined up!", onHit: onHitTimeBonus },
    { name: "teleport-piece", title: "Teleport the piece to a random location. Vroom vroom!", onHit: onHitTeleportPiece },
    { name: "lock-piece", title: "Lock the piece for 4-6 seconds. Brr cold!", onHit: onHitLockPiece },
    { name: "undo-piece", title: "Undo the last piece, including any penalty", onHit: onHitUndoPiece, isClickable: true },
  ],
  
  placeItems() {
    let minItems = 0;
    let maxItems = 5;
    let minWalls = 0;
    let maxWalls = 6;
    
    // Add some variety, sometimes we get no items, sometimes a ton, sometimes only walls, sometimes no walls
    if (util.getRandomFloat() < 0.3) {
      minItems = 0;
      maxItems = 0;
    }
    else if (util.getRandomFloat() > 0.9) {
      minItems = 5;
      maxItems = 10;
    }
    if (util.getRandomFloat() < 0.3) {
      minWalls = 4;
      maxWalls = 10;
      
      if (util.getRandomBoolean()) {
        minItems = 0;
        maxItems = 0;
      }
    }
    else if (util.getRandomFloat() > 0.9) {
      minWalls = 0;
      maxWalls = 0;
    }
    
    // Place anything
    for (let i = 0; i < util.getRandomInt(minItems, maxItems); i++) {
      this.createItem();
    }
    // Place only walls
    for (let i = 0; i < util.getRandomInt(minWalls, maxWalls); i++) {
      this.createItem(true);
    }
  },
  
  createItem(isOnlyWalls = false) {
    // Decide which item to create
    const itemObj = isOnlyWalls ? wallItem : this.available[Math.floor(rand.random() * this.available.length)];
    const newItem = itemObj.isWall ? document.createElement("div") : document.createElement("img");
    
    if (itemObj.isWall) {
      newItem.className = "item wall";
      
      // Start as a vertical wall
      newItem.style.height = util.getRandomInt(10, 60) + "%";
      newItem.style.width = Math.max(state.mapWidth/50, 10) + "px";
      
      // With an even chance to be horizontal
      if (util.getRandomBoolean()) {
        const oldWidth = new String(newItem.style.width);
        newItem.style.width = newItem.style.height;
        newItem.style.height = oldWidth;
      }
    }
    else {
      newItem.className = "item";
      
      newItem.src = `./items/${itemObj.name}.png`;
      newItem.draggable = false;
    }
    
    if (itemObj.title) {
      newItem.title = itemObj.title;
    }
    
    // TODO Consider a glowing border of red or green if the item is positive or negative? Or gold or like a button for clickable?
    newItem.style.left = util.getRandomInt(0, state.mapWidth) + "px";
    newItem.style.top = util.getRandomInt(0, state.mapHeight) + "px";
    
    // Add a listener if we're supposed to be clickable as well as collidable
    if (itemObj.isClickable) {
      newItem.addEventListener("click", () => {
        if (itemObj.onHit()) {
          this.removeItem(newItem);
        }
      });
    }
    
    elements.map.appendChild(newItem);
    
    this.all.push({
      ...itemObj,
      element: newItem,
      onHit: (...args) => {
        console.log(`onHit with ${itemObj.name}`, args);
        if (typeof itemObj.onHit === "function" && itemObj.onHit(...args)) {
          this.removeItem(newItem);
        }
      }
    });
  },
  
  removeItem(itemEle) {
    const foundIndex = items.all.findIndex((check) => itemEle === check.element);
    if (foundIndex !== -1) {
      items.all.splice(foundIndex, 1);
      elements.map.removeChild(itemEle);
    }
  },
}

function onHitTimePenalty(dollPiece, itemObj) {
  const penalty = util.getRandomInt(5, 10);
  state.score.total += penalty;
  state.score.itemPenalty += penalty;
  elements.scoreMessage.textContent = `+${penalty} beer`;
  return true;
}

function onHitTimeBonus(dollPiece, itemObj) {
  const bonus = util.getRandomInt(3, 5);
  state.score.total -= bonus;
  elements.scoreMessage.textContent = `-${bonus} coffee`;
  return true;
}

function onHitTeleportPiece(dollPiece, itemObj) {
  // This simulated click cancels the drag (which also fires onDragEnd)
  window.dispatchEvent(new PointerEvent("pointerup"));
  
  // After next render move the piece
  setTimeout(() => {
    // TTODO Bug, see in randomizePiecePosition for details
    // dollPiece.style.translate = `${util.getRandomInt(50, 200)}px ${util.getRandomInt(50, 200)}px`;
    randomizePiecePosition(dollPiece);
  });
  return true;
}

function onHitLockPiece(dollPiece, itemObj) {
  window.dispatchEvent(new PointerEvent("pointerup"));
  
  const initialPointerEvents = new String(dollPiece.style.pointerEvents);
  const initialOpacity = new String(dollPiece.style.opacity);
  const initialFilter = new String(dollPiece.style.filter);
  
  elements.scoreMessage.textContent = "Frozen";
  dollPiece.style.pointerEvents = "none";
  dollPiece.style.opacity = 0.1;
  dollPiece.style.filter = "drop-shadow(red 0 0 5px) !important";
  
  setTimeout(() => {
    elements.scoreMessage.textContent = "Unfrozen";
    dollPiece.style.pointerEvents = initialPointerEvents;
    dollPiece.style.opacity = initialOpacity;
    dollPiece.style.filter = initialFilter;
  }, util.getRandomInt(4, 6) * 1000);
  return true;
}

function onHitUndoPiece(dollPiece, itemObj) {
  return undoDropMatchedPiece();
}
const wallItem = { name: "wall", isWall: true };

window.items = {
  all: [], // element, boundingRect (set later as a cache), onHit (func)
  available: [
    wallItem,
    { name: "time-penalty", title: "5-10 second time penalty. Stop for a beer!", onHit: onHitTimePenalty },
    { name: "time-bonus", title: "3-5 second time bonus. Get caffeined up!", onHit: onHitTimeBonus, isClickable: true },
    // TODO Until bug is fixed on teleport (see TODO TELEPORT) let's remove for demo { name: "teleport-piece", title: "Teleport the piece to a random location. Vroom vroom!", onHit: onHitTeleportPiece },
    { name: "lock-piece", title: "Lock the piece for 4-6 seconds. Brr cold!", onHit: onHitLockPiece },
    { name: "undo-piece", title: "Undo the last piece, including any penalty", onHit: onHitUndoPiece, isClickable: true },
    { name: "blackout", title: "Darken the screen a ton for 4-10 seconds. You'll feel better in the morning!", onHit: onHitBlackout },
    { name: "blur", title: "Blur the screen a ton for 8-12 seconds. Wait for the hangover!", onHit: onHitBlur },
    { name: "flip", title: "Flip the map for 5 seconds. Dragging is tough!", onHit: onHitFlip },
    { name: "skew", title: "Skew the map for 5 seconds. Then you can remove the screw from your head!", onHit: onHitSkew },
  ],
  
  placeItems() {
    let minItems = 0;
    let maxItems = 8;
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
      this.createItem(false, false);
    }
    // Place walls
    for (let i = 0; i < util.getRandomInt(minWalls, maxWalls); i++) {
      this.createItem(true);
    }
  },
  
  createItem(isOnlyWalls = false, isAllowWalls = true) {
    // Decide which item to create
    let filteredItems = this.available;
    if (isOnlyWalls) {
      filteredItems = this.available.filter(item => item.isWall);
    }
    else if (!isAllowWalls) {
      filteredItems = this.available.filter(item => !item.isWall);
    }
    
    const itemObj = isOnlyWalls ? wallItem : util.getRandomItemFromArray(filteredItems);
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
      newItem.style.cursor = "pointer";
      newItem.addEventListener("click", () => {
        if (typeof itemObj.onHit === "function" && itemObj.onHit() !== false) {
          this.removeItem(newItem);
        }
      });
    }
    
    elements.map.appendChild(newItem);
    
    this.all.push({
      ...itemObj,
      element: newItem,
      onHit: (...args) => {
        if (typeof itemObj.onHit === "function" && itemObj.onHit(...args) !== false) {
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
  
  getRandomItem(isNoWalls = false) {
    if (items.all.length) {
      let checkList = items.all;
      
      if (isNoWalls) {
        checkList = checkList.filter(item => !item.isWall);
      }
      if (checkList.length) {
        return util.getRandomItemFromArray(checkList);
      }
    }
    return null;
  },
}

function _onHitGenericFilterTransform(timeSeconds, textPrefix, filter, transform, opacity) {
  if (filter) {
    elements.map.style.filter = (elements.map.style.filter ?? "") + " " + filter;
  }
  if (transform) {
    elements.map.style.transform = (elements.map.style.transform ?? "") + " " + transform;
  }
  if (typeof opacity === "number") {
    elements.map.style.opacity = opacity;
  }
  
  if (textPrefix) {
    elements.scoreMessage.textContent = textPrefix + (timeSeconds ? ` ${timeSeconds}s` : "");
  }
  
  if (typeof timeSeconds === "number" && timeSeconds > 0) {
    setTimeout(() => {
      // TODO Could be more granular, since technically if you hit a 10 second filter/transform item then a 1 second the 1 second clears BOTH
      elements.map.style.removeProperty("filter");
      elements.map.style.removeProperty("transform");
      
      if (typeof opacity === "number") {
        elements.map.style.opacity = 1;
      }
    }, timeSeconds * 1000);
  }
}

function onHitTimePenalty(dollPiece, itemObj) {
  const penalty = util.getRandomInt(5, 10);
  state.score.total += penalty;
  state.score.itemPenalty += penalty;
  elements.scoreMessage.textContent = `+${penalty} beer`;
  
  _onHitGenericFilterTransform(0.5, null, "blur(1px)");
}

function onHitTimeBonus(dollPiece, itemObj) {
  const bonus = util.getRandomInt(3, 5);
  state.score.total -= bonus;
  elements.scoreMessage.textContent = `-${bonus} coffee`;
}

function onHitTeleportPiece(dollPiece, itemObj) {
  // This simulated click cancels the drag (which also fires onDragEnd)
  window.dispatchEvent(new PointerEvent("pointerup"));
  
  // After next render move the piece
  setTimeout(() => {
    // TODO TELEPORT Bug, see in randomizePiecePosition for details
    // dollPiece.style.translate = `${util.getRandomInt(50, 200)}px ${util.getRandomInt(50, 200)}px`;
    randomizePiecePosition(dollPiece);
  });
}

function onHitLockPiece(dollPiece, itemObj) {
  const frozenTime = util.getRandomInt(4, 6);
  
  window.dispatchEvent(new PointerEvent("pointerup"));
  
  const initialPointerEvents = new String(dollPiece.style.pointerEvents);
  const initialOpacity = new String(dollPiece.style.opacity);
  const initialFilter = new String(dollPiece.style.filter);
  
  elements.scoreMessage.textContent = `Frozen for ${frozenTime}s`;
  dollPiece.style.pointerEvents = "none";
  dollPiece.style.opacity = 0.1;
  dollPiece.style.filter = "drop-shadow(red 0 0 5px) !important";
  
  setTimeout(() => {
    elements.scoreMessage.textContent = "Unfrozen";
    dollPiece.style.pointerEvents = initialPointerEvents;
    dollPiece.style.opacity = initialOpacity;
    dollPiece.style.filter = initialFilter;
  }, frozenTime * 1000);
}

function onHitUndoPiece(dollPiece, itemObj) {
  return undoDropMatchedPiece();
}

function onHitBlackout(dollPiece, itemObj) {
  _onHitGenericFilterTransform(util.getRandomInt(4, 10), "Blackout for", null, null, 0.05);
}

function onHitBlur(dollPiece, itemObj) {
  _onHitGenericFilterTransform(util.getRandomInt(8, 12), "Drunk for", "blur(15px)");
}

function onHitFlip(dollPiece, itemObj) {
  _onHitGenericFilterTransform(5, "Flip for", "sepia(1)", util.getRandomBoolean() ? "scaleY(-1)" : "scaleX(-1)");
}

function onHitSkew(dollPiece, itemObj) {
  const skewAmount = util.getRandomInt(10, 25) * (util.getRandomBoolean() ? 1 : -1);
  _onHitGenericFilterTransform(5, "Screwed for", null, `skew(${skewAmount}deg, ${skewAmount}deg)`);
}
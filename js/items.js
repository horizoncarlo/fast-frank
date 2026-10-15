window.items = {
  all: [], // element, boundingRect (set later as a cache), onHit (func)
  // TODO More and more items
  available: [
    { name: "time-penalty", title: "5-10 second time penalty. Stop for a beer!", onHit: onHitTimePenalty },
    { name: "time-bonus", title: "3-5 second time bonus. Get caffeined up!", onHit: onHitTimeBonus },
    { name: "teleport-limb", title: "Teleport the piece to a random location", onHit: onHitTeleportLimb },
  ],
  
  placeItems() {
    for (let i = 0; i < util.getRandomInt(1, 5); i++) {
      this.createItem();
    }
  },
  
  createItem() {
    // Decide which item to create
    const itemObj = this.available[Math.floor(rand.random() * this.available.length)];
    
    const newItem = document.createElement("img");
    newItem.src = `./items/${itemObj.name}.png`;
    newItem.draggable = false;
    newItem.className = "item";
    if (itemObj.title) {
      newItem.title = itemObj.title;
    }
    // TODO Consider a glowing border of red or green if the item is positive or negative?
    newItem.style.left = util.getRandomInt(0, state.mapWidth) + "px";
    newItem.style.top = util.getRandomInt(0, state.mapHeight) + "px";
    
    elements.map.appendChild(newItem);
    
    this.all.push({
      element: newItem,
      onHit: (...args) => {
        console.log(`onHit with ${itemObj.name}`, args);
        itemObj.onHit(...args);
        _genericRemove(newItem);
      }
    });
  },
}

function _genericRemove(itemEle) {
  const foundIndex = items.all.findIndex((check) => itemEle === check.element);
  if (foundIndex !== -1) {
    items.all.splice(foundIndex, 1);
    elements.map.removeChild(itemEle);
  }
}

function onHitTimePenalty(dollPiece, itemObj) {
  const penalty = util.getRandomInt(5, 10);
  state.score.total += penalty;
  state.score.itemPenalty += penalty;
  elements.scoreMessage.textContent = `+${penalty} beer`;
}

function onHitTimeBonus(dollPiece, itemObj) {
  const bonus = util.getRandomInt(3, 5);
  state.score.total -= bonus;
  elements.scoreMessage.textContent = `-${bonus} coffee`;
}

function onHitTeleportLimb(dollPiece, itemObj) {
  // This simulated click cancels the drag (which also fires onDragEnd)
  window.dispatchEvent(
    new PointerEvent("pointerup")
  );
  
  // After next render move the piece
  // TTODO
  // setTimeout(() => {
    setTimeout(() => {
      // dollPiece.style.translate = `${util.getRandomInt(50, 200)}px ${util.getRandomInt(50, 200)}px`;
      // console.log("TRANSSSSSSSS", dollPiece.style.translate);
      placeBodyPiece(dollPiece);
    });
  // }, 100);
}
window.util = {
  getRandomInt(min, max) {
      return Math.floor(rand.random() * (max - min + 1)) + min;
  },

  getRandomFloat(min, max, allDecimalPlaces = false) {
      if (typeof min === "undefined" && typeof max === "undefined") {
        return rand.random();
      }
    
      if (!allDecimalPlaces) {
          return parseFloat(((rand.random() * (max - min)) + min).toFixed(3));
      }
      else {
          return (rand.random() * (max - min)) + min;
      }
  },

  getRandomBoolean() {
      return rand.random() > 0.5;
  },
  
  getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(rand.random() * 16)];
    }
    
    return color;
  },
  
  getRandomRGBA() {
    return `rgba(${this.getRandomInt(0, 255)},
                  ${this.getRandomInt(0, 255)},
                  ${this.getRandomInt(0, 255)},
                  ${this.getRandomFloat(0.5, 0.7)})`
  },
  
  getRandomItemFromArray(list) {
    return list[Math.floor(this.getRandomFloat() * list.length)];
  },
  
  changeClassList(forElementId, changes) {
    Object.keys(changes).forEach(change => {
      const found = document.getElementById(forElementId);
      if (found) {
        if (changes[change]) {
          found.classList.add(change);
        }
        else {
          found.classList.remove(change);
        }
      }
    });
  },
  
  addUrlParam(paramName, paramValue) {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set(paramName, paramValue);
    // Arguably could be replaceState, but maybe it's nice to go back in history to different seeds we liked?
    window.history.pushState({}, "", currentUrl);
  },
  
  removeUrlParam(paramName, isReloadAfter = false) {
    if (paramName) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete(paramName);
      window.history.pushState({}, "", currentUrl);
    }
    
    if (isReloadAfter) {
      window.location.reload();
    }
  },
  
  checkOverlap(element1, element2) {
    return this.checkOverlapBounds(element1.getBoundingClientRect(),
                                   element2.getBoundingClientRect());
  },
  
  checkOverlapBounds(element1Bounds, element2Bounds) {
    return !(
        element1Bounds.right <= element2Bounds.left ||
        element1Bounds.left >= element2Bounds.right ||
        element1Bounds.bottom <= element2Bounds.top ||
        element1Bounds.top >= element2Bounds.bottom
    );
  },
  
  // Little fancy, but leverage a common game technique of a Swept AABB Collision, roughly:
  // https://gamedev.net/tutorials/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084
  sweptAabbHitTime(moving, dx, dy, obstacle) {
    const width = moving.right - moving.left;
    const height = moving.bottom - moving.top;
    const minX = obstacle.left - width;
    const maxX = obstacle.right;
    const minY = obstacle.top - height;
    const maxY = obstacle.bottom;
    const x = moving.left;
    const y = moving.top;
    
    if (x > minX && x < maxX &&
        y > minY && y < maxY) {
      return 0;
    }
    
    let xEntry, xExit;
    let yEntry, yExit;
    
    if (dx > 0) {
      xEntry = (minX - x) / dx;
      xExit = (maxX - x) / dx;
    } else if (dx < 0) {
      xEntry = (maxX - x) / dx;
      xExit = (minX - x) / dx;
    } else {
      if (x <= minX || x >= maxX) {
        return null;
      }
      
      xEntry = -Infinity;
      xExit = Infinity;
    }
    
    if (dy > 0) {
      yEntry = (minY - y) / dy;
      yExit = (maxY - y) / dy;
    } else if (dy < 0) {
      yEntry = (maxY - y) / dy;
      yExit = (minY - y) / dy;
    } else {
      if (y <= minY || y >= maxY) {
        return null;
      }
      
      yEntry = -Infinity;
      yExit = Infinity;
    }
    
    const entryTime = Math.max(xEntry, yEntry);
    const exitTime = Math.min(xExit, yExit);
    
    if (
      entryTime < 0 ||
      entryTime > 1 ||
      entryTime > exitTime ||
      exitTime < 0
    ) {
      return null;
    }
    
    return entryTime;
  },
}
window.util = {
  getRandomInt(min, max) {
      return Math.floor(rand.random() * (max - min + 1)) + min;
  },

  getRandomFloat(min, max, allDecimalPlaces) {
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
  
  removeUrlParam(paramName, reloadAfter) {
    if (paramName) {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete(paramName);
      window.history.pushState({}, "", currentUrl);
    }
    
    if (reloadAfter) {
      window.location.reload();
    }
  },
}
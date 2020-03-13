if (!Array.prototype.hasOwnProperty('groupBy') ||
    typeof Array.prototype.groupBy !== 'function') {
  Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
      var val = prop(item);
      groups[val] = groups[val] || [];
      groups[val].push(item);
      return groups;
    }, {});
  };
}

if (!Array.prototype.hasOwnProperty('firstOrDefault') ||
    typeof Array.prototype.firstOrDefault !== 'function') {
  Array.prototype.firstOrDefault = function (func) {
    if (typeof func == 'undefined') {
      return this[0] != null ? this[0] : null;
    } else {
      var res = this.filter( function (item){
        return func(item);
      })[0];
      return res != null ? res : null;
    }
  };
}

if (!Array.prototype.hasOwnProperty('orderBy') ||
    typeof Array.prototype.orderBy !== 'function') {
  Array.prototype.orderBy = function (func, func2) {
    if (typeof func == 'undefined'){
      return this.sort( function (item1, item2) {
        return item1 < item2 ? -1 : item1 > item2 ? 1 : 0;
      });
    } else if (typeof func2 != 'undefined') {
      return this.sort( function (item1, item2) {
        return func(item1) < func(item2) ? -1 : func(item1) === func(item2) ? (func2(item1) > func2(item2) ? 1 : -1) : 1;
      });
    } else {
      return this.sort( function (item1, item2) {
        return func(item1) < func(item2) ? -1 : func(item1) > func(item2) ? 1 : 0;
      });
    }
  }
}

if (!Array.prototype.hasOwnProperty('orderByDesc') ||
    typeof Array.prototype.orderByDesc !== 'function') {
  Array.prototype.orderByDesc = function (func, func2) {
      if (typeof func == 'undefined'){
        return this.sort( function (item1, item2) {
            return item1 > item2 ? -1 : item1 < item2 ? 1 : 0;
        });
      } else if (typeof func2 != 'undefined') {
        return this.sort( function (item1, item2) {
          return func(item1) > func(item2) ? -1 : func(item1) === func(item2) ? (func2(item1) < func2(item2) ? 1 : -1) : 1;
        });
      } else {
        return this.sort( function (item1, item2) {
            return func(item1) > func(item2) ? -1 : func(item1) < func(item2) ? 1 : 0;
          });
      }
  }
}

if (!Array.prototype.hasOwnProperty('any') ||
    typeof Array.prototype.any !== 'function') {
  Array.prototype.any = function (func) {
    if (typeof func == 'undefined'){
      return this.length > 0;
    } else {
      return this.some( function (item) {
          return func(item);
        });
    }
  }
}

if (!Array.prototype.hasOwnProperty('move') ||
    typeof Array.prototype.move !== 'function') {
  Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
  }
}



if (!String.prototype.hasOwnProperty('like') ||
    typeof String.prototype.like !== 'function') {
    String.prototype.like = function (prop) {
      var res = false;
      for (var i = 0; i <= prop.length; i++) {
        if (this.indexOf(i) >= 0) {
          res = true;
        }
      }
      // prop.forEach(i => {
      //   if (this.indexOf(i) >= 0) {
      //     res = true;
      //   }
      // });
      return res;
  }
}

if (!String.prototype.hasOwnProperty('replaceAll') ||
    typeof String.prototype.replaceAll !== 'function') {
    String.prototype.replaceAll = function(search, replacement) {
    return this.replace(new RegExp(search, 'g'), replacement);
  }
}

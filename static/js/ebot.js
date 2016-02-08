/**
 * shoutGlory()
 * updateDocumentation()
 * removeKeyFromArray()
 * retrieveModel()
 * retrieveModelIfNotLoaded()
 * retrieveModelv2()
 * retrieveModelIfNotLoadedv2()
 * getModel()
 * showModal()
 * hideModal()
 * changeModalView()
 * assignHandlerForModalShown()
 * appendErrorMessage()
 * notify()
 * notifyModal()
 * scrollToTop()
 * getUniqueFields()
 * scrollUp()
 * numberWithCommas()
 * insertModalHtml()
 * getRandomInt()
 * logEach()
 * makeElement()
 * dynamicSort()
 * enableStringEndsWith()
 * delay()
 * switchExpandButtonSigns()
 * get()
 * loadKirby()
 * getExpandToggleMainHtml()
 * getExpandToggleRowHtml()
 * assignHandlerExpandToggleRow()
 * assignHandlerExpandToggleMain()
 * drawerify()
 * makeSelectOutOfArrayOfModels()
 * chosenOptions
 * hideOptions
 * showOptions
 * showOptionsShort
 * hideOptionsShort
 * showOptionsMedium
 * hideOptionsMedium
 * showOptionsLong
 * hideOptionsLong
 * toggleOptions
 */
var ebot = {
  
  shoutGlory: function() {
    alert("Glory! Glory!");
    // ebot.updateDocumentation(ebot);
  },
  
  updateDocumentation: function(obj) {
    var output = "/**\n";
    for(member in obj) {
      if(typeof(obj[member]) === "function") {
        output += " * " + member + "()\n";
      } else {
        output += " * " + member + "\n";
      }
    }
    output += " */";
    console.log(output);
  },
  
  removeKeyFromArray: function(array, key) {
    if(typeof(key) === "number") {
      array.splice(i, 1);
      return array;
    } else if (typeof(key) === "string") {
      var i = array.indexOf(key);
      if(i !== -1) {
        array.splice(i, 1);
        return array;
      } else {
        alert("that key doesn't exist");
        return array;
      }
    } else {
      alert("remove takes a number or a string as a parameter");
      return array;
    }
  },
  
  retrieveModel: function(obj, name, queryString) { //expecting a camelcased plural name for name, e.g. blueFrogLegs
    if(typeof(queryString) === "undefined") queryString = "";
    
    return $.ajax({
      type: "GET",
      url: env.getApiUri() + "/" + name + queryString,
      success: function(data, status, jqXHR) {
        var nameUnderscored = name.underscore();
        obj[name] = data._embedded[nameUnderscored];
//        console.table(data)
//        console.table(data._embedded[nameUnderscored])
      },
      error: function(jqXHR, status) {
        console.log("retrieveModel() failed");
      }
    }).promise();
  },
  
  retrieveModelIfNotLoaded: function(obj, name, queryString) {
    if(obj[name].length === 0) {
      return ebot.retrieveModel(obj, name, queryString);
    }
    return $.Deferred().resolve().promise();
  },
  
  /*
   * {
   *  obj: obj,
   *  url: url,
   *  propName: propName,
   *  queryString: queryString
   * }
   * 
   */
  retrieveModelv2: function(options) {
    var queryString = typeof(options.queryString) === "undefined" ? "" : options.queryString;
    var propName = typeof(options.propName) === "undefined" ? options.url : options.propName;
    
    return $.ajax({
      type: "GET",
      url: env.getApiUri() + "/" + options.url + queryString,
      success: function(data, status, jqXHR) {
//        var nameUnderscored = name.underscore();
        options.obj[propName] = data._embedded[options.url.underscore()];
      },
      error: function(jqXHR, status) {
        console.log("retrieveModelv2() failed");
      }
    }).promise();
  },
  
  /*
   * {
   *  obj: obj,
   *  url: url,
   *  propName: propName,
   *  queryString: queryString
   * }
   * 
   */
  retrieveModelIfNotLoadedv2: function(options) {
    var propName = typeof(options.propName) === "undefined" ? options.url : options.propName;
    if(options.obj[propName].length === 0) {
      return ebot.retrieveModelv2(options);
    }
    return $.Deferred().resolve().promise();
  },

  /*
   * {
   *  model: "workOrders",
   *  queryString: "?before=2015-10-07"
   * }
   * 
   */
  getModel: function(options) {
    var queryString = typeof(options.queryString) === "undefined" ? "" : options.queryString;
    var deferred = $.ajax({
      type: "GET",
      url: env.getApiUri() + "/" + options.model + queryString,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {}
    }).promise();
    return deferred;
  },

  /**
   * Requires:
   * 
   * insertModalHtml()
   * 
   */
  showModal: function(headerText, formHtml) {
    headerText = headerText || "";
    formHtml = formHtml || "";
    $("#error-message-div").addClass("hide");
    $("#form-target").html(formHtml);
    $("#modal-header").html("<h4>" + headerText + "</h4>");
    $("#modal").modal("show");
  },

  /**
   * Requires:
   * 
   * insertModalHtml()
   * 
   */
  hideModal: function() {
    $("#modal").modal("hide");
  },
  
  /**
   * Requires:
   * 
   * insertModalHtml()
   * 
   */
  changeModalView: function(htmlString, headerText) {
    $("#form-target").html(htmlString);
    
    if(headerText === false) {
      //leave the header as it is
    } else {
      headerText = headerText || "";
      $("#modal-header").html("<h4>" + headerText + "</h4>");
    }

  },

  /**
   * Requires: 
   * 
   * an element with id="modal"
   * 
   * any fields desired to be focused to have the class "first-field"
   * 
   */
  assignHandlerForModalShown: function() {
    //setting up the event handler, on modal show, focus the first field in the form
    $('#modal').on('shown.bs.modal', function (e) {
      //normal fields
      $(".first-field").focus();
      //chosen select elements
      $(".first-field").trigger("chosen:activate");
    });
  },
  
  /**
   * Requires:
   * 
   * .hide {
   *   display: none !important;
   * }
   * 
   * insertModalHtml()
   * 
   */
  appendErrorMessage: function(jqXHR, message) {
    $("#error-message-status").html(jqXHR.status);
    $("#error-message-status-text").html(jqXHR.statusText);

    if(arguments.length === 2) {
      $("#error-message").html(message + "<br />");
    } 
    
    var responseText = JSON.parse(jqXHR.responseText);
    
    if(typeof(responseText.validation_messages) !== "undefined") {
      $.each(responseText.validation_messages, function(index, element) {
        var indexPretty = index.replace("_id", ""); 
        indexPretty = indexPretty.replace(/_/g, " "); 
        $("#error-message-status-text").append("<br />" + indexPretty + ": " + "'" + element + "'");
      });
    }
    
    $("#error-message-div").removeClass("hide");
  },
  
  /**
   * Requires: 
   * 
   * an element with id="notifications"
   * <div id='notifications'></div>
   * 
#notifications {
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  text-align: center;
  height: 20px;
}
   * 
   */
  notify: function(message, hideTime) {
    
    if(typeof(hideTime) !== "undefined") {
      hideTime = +hideTime;
    } else {
      hideTime = 5000;
    }
    
    $("#notifications").show(); //necessary?
    
    var rand = ebot.getRandomInt(0, 999999);
    htmlString = "<div id='falling-cherry-blossom-" + rand + "' style='display:hidden;'><label>" + message + "</label><br /></div>";
    $("#notifications").append(htmlString);
    $("#falling-cherry-blossom-" + rand).show(ebot.showOptions);
    
    setTimeout(function() {
      $("#falling-cherry-blossom-" + rand).hide(ebot.hideOptionsLong);
    }, hideTime);
    
    setTimeout(function() {
      $("#falling-cherry-blossom-" + rand).remove();
    }, hideTime + 500);
    
  },
  
  /**
   * Requires: 
   * 
   * an element with id="notifications-modal"
   * <div id='notifications-modal'></div>
   * 
#notifications-modal {
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  text-align: center;
  min-height: 20px;
  height: auto;
}
   * 
   */
  notifyModal: function(message, hideTime) {
    
    if(typeof(hideTime) !== "undefined") {
      hideTime = +hideTime;
    } else {
      hideTime = 5000;
    }
    
    $("#notifications-modal").show(); //necessary?

    var rand = ebot.getRandomInt(0, 999999);
    htmlString = "<div id='falling-cherry-blossom-" + rand + "' style='display:hidden;'><label>" + message + "</label><br /></div>";
    $("#notifications-modal").append(htmlString);
    $("#falling-cherry-blossom-" + rand).show(ebot.showOptions);
    
    setTimeout(function() {
      $("#falling-cherry-blossom-" + rand).hide(ebot.hideOptionsLong);
    }, hideTime);

    setTimeout(function() {
      $("#falling-cherry-blossom-" + rand).remove();
    }, hideTime + 500);

  },
  
  scrollToTop: function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
  },
  
  //getting unique fields from one property given an array of objects
  getUniqueFields: function(arrayOfObjects, field) {
    uniqueFields = [];
    arrayOfObjects.forEach(function(element, index, array) {
      if($.inArray(element[field], uniqueFields) === -1) { //if no jquery, replace with indexOf()
        uniqueFields.push(element[field]);
      }
    });
    return uniqueFields;
  },
  
  scrollUp: function() {
    $("html, body").animate({
      scrollTop: 0
    }, 300); 
  },

  //stolen from SO: http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
  numberWithCommas: function(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  },
  
//  if(el[name].length === 0) {
//    var deferred = el.retrieveModel(name);
//    deferred.then(function() {
//      el.fillEntityIdSelect(name);
//    });
//  } else {
//    el.fillEntityIdSelect(name);
//  }
  
  /**
   * Requires: 
   * 
   * an element with id="modal-holder"
   * 
   * 
   * 
   * ebot.insertModalHtml("modal-lg")
   * 
   */
  insertModalHtml: function(size) {
    var _size = size === undefined ? "" : size
    var htmlString = "" + 
    "<div id='modal' class='modal fade'>" +
    "  <div class='modal-dialog " + _size + "'>" +
    "    <div class='modal-content'>" +
    "      <div id='modal-header' class='modal-header'></div>" +
    "      <div id='modal-body' class='modal-body'>" +
    "        <div id='notifications-modal'></div> " +
    "        <div id='error-message-div' class='hide'> " +
    "          <div class='alert alert-danger' role='alert'> " +
    "            <span class='glyphicon glyphicon-exclamation-sign' aria-hidden='true'></span> " +
    "            <span id='error-message'></span><br /> " +
    "            <span id='error-message-status'></span>: " +
    "            <span id='error-message-status-text'></span> " +
    "          </div> " +
    "        </div>" +
    "        <div id='form-target'></div>" +
    "      </div>" +
    "      <div id='modal-footer' class='modal-footer'></div>" +
    "    </div><!-- /.modal-content -->" +
    "  </div><!-- /.modal-dialog -->" +
    "</div><!-- /.modal -->";
    
    $("#modal-holder").html(htmlString);
  },
  
  /**
   *  Returns a random integer between min (inclusive) and max (inclusive) 
   *  Using Math.round() will give you a non-uniform distribution! 
   */ 
  getRandomInt: function(min, max) { 
    return Math.floor(Math.random() * (max - min + 1)) + min; 
  },
  
  logEach: function(iterable) {
    if(Array.isArray(iterable)) {
      iterable.forEach(function(element) {
        console.log(element);
      });
    } else {
      for(prop in iterable) {
        console.log(prop + ": " + iterable[prop]);
      }
    }
  },
  
  
  /*
   * for when I add tests:
   * 
  var randomNum = 3;
  
  var elementOptions = {
      tag: "input",
      id: "id1", 
      class: "classname1",
      "profile-parameter-id": randomNum
  };
  var elementHtml = ebot.makeElement(elementOptions);
  
  console.log(elementHtml);

  var elementOptions = {
    tag: "button",
    id: "id2", 
    class: "classname2",
    "profile-parameter-id": randomNum,
    content: "I'm a button! :D"
  };
  var elementHtml = ebot.makeElement(elementOptions);
  
  console.log(elementHtml);
  
  <input id='id1' class='classname1' profile-parameter-id='3'>
  <button id='id2' class='classname2' profile-parameter-id='3'>I'm a button! :D</button>
  
   * 
   */
  makeElement: function(element) {
    var htmlString = "";
    var voidElements = ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"];
    
    htmlString += "<" + element.tag;
    
    for(var prop in element) {
      if(element.hasOwnProperty(prop) && prop !== "tag" && prop !== "content") {
        
        //class is a reserved keyword
        if(prop === "_class") {
          htmlString += " class='" + element[prop] + "'";
        } else {
          htmlString += " " + prop + "='" + element[prop] + "'";
        }
      } 
    }

    htmlString += ">";
    
    //if the element isn't a void element
    if(voidElements.indexOf(element.tag) === -1) {
      var content = element.content ? element.content : "";
      htmlString += content + "</" + element.tag + ">";
    }

    return htmlString;
  },
  
  //http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript
  dynamicSort: function(arrayOfObjects, propertyToSortBy, propertyType, ascending) {
    var asc = ascending !== undefined ? ascending : true;

    function compare(a, b) {
      if(asc) {
        if (a[propertyToSortBy] < b[propertyToSortBy])
          return -1;
        if (a[propertyToSortBy] > b[propertyToSortBy])
          return 1;
        return 0;
      } else {
        if (a[propertyToSortBy] > b[propertyToSortBy])
          return -1;
        if (a[propertyToSortBy] < b[propertyToSortBy])
          return 1;
        return 0;
      }
    }
    
    function compare2(a, b) {
      var value1 = moment(a[propertyToSortBy]);
      var value2 = moment(b[propertyToSortBy]);
      if(asc) {
        if(value1.isAfter(value2))
          return -1;
        if(value1.isBefore(value2))
          return 1;
        return 0;
      } else {
        if(value1.isBefore(value2))
          return -1;
        if(value1.isAfter(value2))
          return 1;
        return 0;
      }
    }
        
    if(propertyType === "date") {
      arrayOfObjects.sort(compare2);
    } else {
      arrayOfObjects.sort(compare);
    }

    return arrayOfObjects;
  },
  
  enableStringEndsWith: function() {
    if (typeof String.prototype.endsWith !== 'function') {
      String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
      };
    }
  },
  
  delay: function(ms) {
    return new Promise(function(resolve, reject) {
      setTimeout(resolve, ms);
    });
  },
  
  switchExpandButtonSigns: function(jqueryNodeString) {
    var node = $(jqueryNodeString);
    if(node.attr("glyphicon") === "minus") {
      node.html("<i class='glyphicon glyphicon-plus'></i>");
      node.attr("glyphicon", "plus");
    } else {
      node.html("<i class='glyphicon glyphicon-minus'></i>");
      node.attr("glyphicon", "minus");
    }
  },
  
  get: function(partialUrl) { //includes model name, e.g. `/protocols/${shipmentOrder.protocol_id}?include[]=step_group`
    return $.ajax({
      type: "GET",
      url: env.getApiUri() + partialUrl,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("Error")}
    }).promise()
  },
  
  loadKirby: function(selector) {
    if((env.getApiUri()).indexOf("staging") > -1) {
      var htmlString = "<img id='kirby' src='images/Dancing_kirby.gif' style='height: 50px;'>";
      if(selector === undefined) {
        $("#footerwrap .container").html(htmlString);
      } else {
        $(selector).html(htmlString);
      }
    }
  },
  
  getExpandToggleMainHtml: function() {
    return "<button id='expand-toggle' class='btn btn-md' glyphicon='minus'><i class='glyphicon glyphicon-minus'></i></button>";
  },

  getExpandToggleRowHtml: function(uniqueAttrName, uniqueAttrValue) {
    return "<button class='btn btn-sm expand-button' " + uniqueAttrName + "='" + uniqueAttrValue + "' glyphicon='minus'><i class='glyphicon glyphicon-minus'></i></button>";
  },
  
  assignHandlerExpandToggleRow: function(uniqueAttrName) {
    $(".expand-button").click(function() {
      $("tr[" + uniqueAttrName + "='" + $(this).attr(uniqueAttrName) + "']").toggle(ebot.toggleOptions)
      ebot.switchExpandButtonSigns(this)
    })
  },
  
  assignHandlerExpandToggleMain: function(uniqueAttrName) {
    $("#expand-toggle").click(function() {
      var sign = $(this).attr("glyphicon")

      $(".expand-button").each(function(index, element) {
        var row = $("tr[" + uniqueAttrName + "='" + $(element).attr(uniqueAttrName) + "']")
        if(sign === "plus") {
          row.show(ebot.showOptions)
          $(element).html("<i class='glyphicon glyphicon-minus'></i>").attr("glyphicon", "minus")
        } else {
          row.hide(ebot.showOptions)
          $(element).html("<i class='glyphicon glyphicon-plus'></i>").attr("glyphicon", "plus")
        }
      })

      ebot.switchExpandButtonSigns(this)
    })
  },
  


  /**
   * needs this css: 
   * 
     #drawer-handle-top {
        width: 50px;
        margin: 0 auto;
      }

      #drawer-handle-bottom {
        position: fixed;
        bottom: 0px;
        width: 50px;
      }

      #drawer-handle-left {
        position: relative;
        width: 50px;
      }

     #drawer-handle-right {
        position: fixed;
        width: 50px;
      }
      
      .drawer-handle i {
        font-size: 35px;
        opacity: .4;
      }
      
      .drawer-handle i:hover {
        -webkit-filter: invert(20%);
      }
   *
   *
   * Example options object:

{
  fromThe: "top"
  selector: "drawer-id",
  contents: "drawer-contents-id"
  opacity: .6
}

   *
   *
   *
   */
  drawerify: function(options) {
    var drawer = $(options.selector)
    var drawerContents = $(options.contents)
    var drawerVisible = false
    var drawerHeight = drawer.height()
    var drawerWidth = drawer.width()

    var drawerifyTop = function drawerifyTop() {
      drawer
        .after("<div id='drawer-handle-top' class='drawer-handle'><i class='glyphicon glyphicon-chevron-down'></i></div>")
        .css("opacity", 0)
        .css("height", "0px")

      drawerContents
        .css("opacity", 0).css("display", "none")

      var drawerHandleContainer = $("#drawer-handle-top")
      var drawerHandle = $("#drawer-handle-top i")

      $("#drawer-handle-top i").click(function() {
        if(!drawerVisible) {
          drawer.velocity({
            height: `${drawerHeight}px`,
            opacity: options.opacity
          },
          {
            complete: function(elements) { 
              drawerContents.css("display", "block")
              drawerContents.velocity({opacity: options.opacity})
            }
          })
          drawerHandle.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
          drawerVisible = true
        } else {
          drawerContents.css("opacity", 0).css("display", "none")
          drawer.velocity({
            height: `0px`,
            opacity: 0
          })
          drawerHandle.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
          drawerVisible = false
        }
      })
    }

    var drawerifyBottom = function drawerifyBottom() {
      drawer
        .before(`<div id='drawer-handle-bottom' class='drawer-handle' style='left: ${(drawerWidth/2)-25}px'><i class='glyphicon glyphicon-chevron-up'></i></div>`)
        .css("opacity", 0)
        .css("height", "0px")

      drawerContents
        .css("opacity", 0).css("display", "none")

      var drawerHandleContainer = $("#drawer-handle-bottom")
      var drawerHandle = $("#drawer-handle-bottom i")

      $("#drawer-handle-bottom i").click(function() {
        if(!drawerVisible) {
          drawer.velocity({
            height: `${drawerHeight}px`,
            opacity: options.opacity
          },
          {
            complete: function(elements) { 
              drawerContents.css("display", "block")
              drawerContents.velocity({opacity: options.opacity})
            }
          })
          drawerHandle.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down")
          drawerHandleContainer.velocity({
            bottom: `${drawerHeight}px`,
          })
          drawerVisible = true
        } else {
          drawerContents.css("opacity", 0).css("display", "none")
          drawer.velocity({
            height: `0px`,
            opacity: 0
          })
          drawerHandle.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up")
          drawerHandleContainer.velocity({
            bottom: `0px`,
          })
          drawerVisible = false
        }
      })
    }

    var drawerifyLeft = function drawerifyLeft() {

      drawer
        .after(`<div id='drawer-handle-left' class='drawer-handle' style='top: ${(drawerHeight/2)-25}px'><i class='glyphicon glyphicon-chevron-right'></i></div>`)
        .css("opacity", 0)
        .css("width", "0px")

      drawerContents
        .css("opacity", 0).css("display", "none")

      var drawerHandleContainer = $("#drawer-handle-left")
      var drawerHandle = $("#drawer-handle-left i")

      $("#drawer-handle-left i").click(function() {
        if(!drawerVisible) {
          drawer.velocity({
            width: `${drawerWidth}px`,
            opacity: options.opacity
          },
          {
            complete: function(elements) { 
              drawerContents.css("display", "block")
              drawerContents.velocity({opacity: options.opacity})
            }
          })
          drawerHandle.removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-left").velocity({
            left: `${drawerWidth}px`,
          })
          drawerVisible = true
        } else {
          drawerContents.css("opacity", 0).css("display", "none")
          drawer.velocity({
            width: `0px`,
            opacity: 0
          })
          drawerHandle.removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right").velocity({
            left: `0px`
          })
          drawerVisible = false
        }
      })
    }

    var drawerifyRight = function drawerifyRight() {

      drawer
        .after(`<div id='drawer-handle-right' class='drawer-handle' style='top: ${(drawerHeight/2)-25}px;right: 0px'><i class='glyphicon glyphicon-chevron-left'></i></div>`)
        .css("opacity", 0)
        .css("width", "0px")

      drawerContents
        .css("opacity", 0).css("display", "none")

      var drawerHandleContainer = $("#drawer-handle-right")
      var drawerHandle = $("#drawer-handle-right i")

      $("#drawer-handle-right i").click(function() {
        if(!drawerVisible) {
          drawer.velocity({
            width: `${drawerWidth}px`,
            opacity: options.opacity
          },
          {
            complete: function(elements) { 
              drawerContents.css("display", "block")
              drawerContents.velocity({opacity: options.opacity})
            }
          })
          drawerHandle.removeClass("glyphicon-chevron-left").addClass("glyphicon-chevron-right").velocity({
            right: `${drawerWidth}px`,
          })
          drawerVisible = true
        } else {
          drawerContents.css("opacity", 0).css("display", "none")
          drawer.velocity({
            width: `0px`,
            opacity: 0
          })
          drawerHandle.removeClass("glyphicon-chevron-right").addClass("glyphicon-chevron-left").velocity({
            right: `0px`,
          })
          drawerVisible = false
        }
      })
    }

    switch(options.fromThe) {
      case "top":
        drawerifyTop()
        break
      case "bottom":
        drawerifyBottom()
        break
      case "left":
        drawerifyLeft()
        break
      case "right":
        drawerifyRight()
        break
      default:
        drawerifyTop()
    }

    
  },
  
  makeSelectOutOfArrayOfModels: function(arrayOfModels, modelName, selectProps, optionToSelect) {
    if(arrayOfModels !== undefined) {
      var formField = "<select ";
    
      for(prop in selectProps) {
        formField += prop + "='" + selectProps[prop] + "' ";
      }
      
      formField += ">";
      
      //empty option for chosen
      formField += "<option value=''></option>";
      
      arrayOfModels.forEach(function(model) {
        if(optionToSelect === model[modelName + "_id"]) {
          formField += "<option value='" + model[modelName + "_id"] + "' selected>" + model.name + "</option>";
        } else {
          formField += "<option value='" + model[modelName + "_id"] + "'>" + model.name + "</option>";
        }
        
      });
  
      formField += "</select>";
      
      return formField;
    } else {
      console.log("empty array of models in ebot.makeSelectOutOfArrayOfModels")
      return "<select id=''><option value=''>Erro</option></select>"
    }
    
  },

  retrieveEntity: function(obj, name, queryString) { //expecting a camelcased plural name for name, e.g. blueFrogLegs
    if(typeof(queryString) === "undefined") queryString = ""
    
    var deferred = $.ajax({
      type: "GET",
      // url: env.getApiUri() + "/" + name + queryString,
      url: abc.apiurl + "/" + name + queryString,
      success: function(data, status, jqXHR) {
        obj[name] = data
      },
      error: function(jqXHR, status) {
        console.log("retrieveEntity() failed")
      }
    }).promise()

    return deferred
  },

  chosenOptions: {
    search_contains: true
  },
  
  hideOptions: {
    duration: 250
  },
  
  showOptions: {
    duration: 250
  },

  showOptionsShort: {
    duration: 1000
  },
  
  hideOptionsShort: {
    duration: 1000
  },

  showOptionsMedium: {
    duration: 1500
  },
  
  hideOptionsMedium: {
    duration: 1500
  },

  showOptionsLong: {
    duration: 2000
  },
  
  hideOptionsLong: {
    duration: 2000
  },
  
  toggleOptions: {
    duration: 250  
  },
    
};
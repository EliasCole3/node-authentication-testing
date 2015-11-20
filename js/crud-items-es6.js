$(() => {
  abc.initialize()
  // ebot.updateDocumentation(abc)
})

let abc = {
  
  initialize: () => {
    abc.assignInitialHandlers()
    ebot.insertModalHtml()
  },

  assignInitialHandlers: () => {
    abc.handlerItemCreateButton()
    abc.getItems().then(items => {
      abc.items = items
      abc.createTable()
    })
  },

  createTable: () => {
    let htmlString = `<table id='item-table' class='table'>`

    htmlString += `
    <tr>
      <th>Item Id</th>
      <th>Name</th>
      <th>Cost</th>
      <th>Flavor Text</th>
      <th>Effect</th>
      <th>Image Filename</th>
      <th></th>
      <th></th>
    </tr>`

    abc.items.forEach(item => {
      htmlString += `<tr data-id='${item._id}'>`
      htmlString += `<td>${item.itemId}</td>`
      htmlString += `<td>${item.name}</td>`
      htmlString += `<td>${item.cost}</td>`
      htmlString += `<td>${item.flavorText}</td>`
      htmlString += `<td>${item.effect}</td>`
      htmlString += `<td>${item.imageFilename}</td>`
      htmlString += `<td><button class='btn btn-sm update-item' data-id='${item._id}'>Update</button></td>`
      htmlString += `<td><button class='btn btn-sm delete-item' data-id='${item._id}'>Delete</button></td>`
      htmlString += `</tr>`
    })


    htmlString += `</table>`
    $("#item-table-wrapper").html(htmlString)
    abc.handlerItemTable()
  },

  handlerItemTable: () => {
    $(".update-item").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Update Item`, abc.getItemForm())
      abc.fillItemFormWithOldData(id)
      abc.handlerUpdate(id)
    })

    $(".delete-item").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      ebot.showModal(`Are you sure?`, `<button id='submit-deletion' class='btn btn-lg form-control' data-id='${id}' type='submit'>Yes</button>`)
      abc.handlerDelete()
    })
  },

  handlerItemCreateButton: () => {
    $("#item-create-button").click(e => {
      ebot.showModal("New Item", abc.getItemForm())
      abc.handlerCreate()
    })
  },

  handlerCreate: () => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "itemId": $("#item-id").val(),
        "name": $("#name").val(),
        "cost": $("#cost").val(),
        "flavorText": $("#flavor-text").val(),
        "effect": $("#effect").val(),
        "imageFilename": $("#image-filename").val()
      })

      abc.createItem(jsonData).then(data => {
        abc.getItems().then(items => {
          abc.items = items
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerUpdate: id => {
    $("#submit").click(e => {
      let jsonData = JSON.stringify({
        "itemId": $("#item-id").val(),
        "name": $("#name").val(),
        "cost": $("#cost").val(),
        "flavorText": $("#flavor-text").val(),
        "effect": $("#effect").val(),
        "imageFilename": $("#image-filename").val()
      })

      abc.updateItem(id, jsonData).then(data => {
        abc.getItems().then(items => {
          abc.items = items
          abc.createTable()
          ebot.hideModal()
        })
      })
    })
  },

  handlerDelete: () => {
    $("#submit-deletion").click(e => {
      let button = $(e.currentTarget)
      let id = button.attr("data-id")
      abc.deleteItem(id).then(() => {
        ebot.hideModal()
        $(`tr[data-id=${id}]`).remove()
      })
    })
  },

  getItemForm: () => {
    let htmlString = `
    <label>Item Id</label> <input id='item-id' type='number' class='form-control'><br />
    <label>Name</label> <input id='name' class='form-control'><br />
    <label>Cost</label> <input id='cost' class='form-control'><br />
    <label>Flavor Text</label> <textarea id='flavor-text' class='form-control'></textarea><br /><br />
    <label>Effect</label> <input id='effect' class='form-control'><br />
    <label>Image Filename</label> <input id='image-filename' class='form-control'><br />
    <button id='submit' class='form-control' type='submit'>Submit</button>`
    return htmlString
  },

  fillItemFormWithOldData: id => {
    abc.getItem(id).then(data => {
      $("#item-id").val(data.itemId),
      $("#name").val(data.name),
      $("#cost").val(data.cost),
      $("#flavor-text").val(data.flavorText),
      $("#effect").val(data.effect),
      $("#image-filename").val(data.imageFilename)
    })
  },

  getItems: () => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/items`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getItems() Error")}
    }).promise()

    return deferred
  },

  createItem: jsonData => {
    console.log(jsonData)
    let deferred = $.ajax({
      type: "POST",
      url: `${abc.apiurl}/items`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error creating a Item")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  getItem: id => {
    let deferred = $.ajax({
      type: "GET",
      url: `${abc.apiurl}/items/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("getItem() Error")}
    }).promise()

    return deferred
  },

  updateItem: (id, jsonData) => {
    let deferred = $.ajax({
      type: "PUT",
      url: `${abc.apiurl}/items/${id}`,
      data: abc.convertJsonToFormData(jsonData),
      contentType: "application/x-www-form-urlencoded; charset=UTF-8",
      success: (data, status, jqXHR) => {},
      error: (jqXHR, status) => {
        ebot.notify("error updating a Item")
        console.log(jqXHR)
      }
    }).promise()

    return deferred
  },

  deleteItem: id => {
    let deferred = $.ajax({
      type: "DELETE",
      url: `${abc.apiurl}/items/${id}`,
      success: function(data, status, jqXHR) {},
      error: function(jqXHR, status) {console.log("deleteItem() Error")}
    }).promise()

    return deferred
  },

  convertJsonToFormData: json => {
    let string = ``

    json = JSON.parse(json)

    for(let prop in json) {
      let converted = `${prop}=${encodeURI(json[prop])}&`
      converted = converted.replace(/%20/g, "+")
      string += converted
    }
    string = string.replace(/&$/g, "")

    return string
  },

  // apiurl: "http://localhost:8082",
  apiurl: "http://192.241.203.33:8082",

  items: []

}
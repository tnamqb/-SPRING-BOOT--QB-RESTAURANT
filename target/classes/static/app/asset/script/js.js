// filterSelection("all")
// function filterSelection(c) {
//   var x, i;
//   x = document.getElementsByClassName("drink-container");
//   if (c == "all") c = "";
//   for (i = 0; i < x.length; i++) {
//     w3RemoveClass(x[i], "show");
//     if (x[i].className.indexOf(c) > -1) w3AddClass(x[i], "show");
//   }
// }

//----------Get All Item In Client Page-----------//
function getAllItem(){
    $.ajax({
        type: "GET",
        url: "/app/allItem"
    }).done(function (product){
        let content = "";
        for (let i = product.length-1; i >= 0; i--) {
            content += `
                        <div class="drink-container specials">
                            <img src="/uploads/${product[i].image}" alt="${product[i].productName}">
                            <div class="overlay">
                                <div class="text mt-3">${product[i].productName}</div>
                                <div class="text">${product[i].price}</div>
                                <button class="button-overlay" onclick="adToOrder(${product[i].productId})">Đặt món</button>
                            </div>
                        </div>
                `;
        }
        $(".food-information").html(content);
    })
}
getAllItem();

//----------Get All Item In Client Page-----------//


//----------Get All Category---------------------//
function getAllItemCategory(){
    $.ajax({
        type: "GET",
        url: "/app/allItemCategory"
    }).done(function (category){
        let content = "<div class=\"category btn activee\" style=\"padding: 0;\">\n" +
            "          <div class=\"category-title\">\n" +
            "          <p onclick=\"getAllItem()\">Tất Cả</p>\n" +
            "          </div>\n" +
            "          </div>";
        for (let i = 0; i < category.length; i++) {
            content += `
                        <div class="category-title" onclick="getProductByCategoryID(${category[i].categoryId})" >
                            <p>${category[i].categoryName}</p>
                        </div>
                    `;
        }
        $("#categories").html(content);
    })
}

getAllItemCategory();

//----------Get All Category---------------------//

//----------Get Product By Id-------------------//
function getProductByCategoryID(categoryId){
    $.ajax({
        type: "GET",
        url: `/app/allProductByCategory/${categoryId}`,
        success: function (product){
            let content = "";
            for (let i = 0; i < product.length ; i++) {
                content += `
                        <div class="drink-container specials">
                            <img src="/uploads/${product[i].image}" alt="${product[i].productName}">
                            <div class="overlay">
                                <div class="text mt-3">${product[i].productName}</div>
                                <div class="text">${product[i].price}</div>
                                <button class="button-overlay" onclick="adToOrder(${product[i].productId})" >Đặt món</button>
                            </div>
                        </div>
                  `;
            }
            drawActive();
            $('.food-information').html(content);
        }
    })
}
//---------- Draw class active in class category-title---------//
function drawActive(){
    let head = document.getElementById("categories");
    let cate = head.getElementsByClassName("category-title");
    for(let i = 0; i < cate.length; i++){
        cate[i].addEventListener('click', function(){
            let current = document.getElementsByClassName("activee");
            current[0].className = current[0].className.replace(" activee", "");
            this.className += " activee";
        })
    }
}
//---------- Draw class active in class category-title---------//


//---------- Get Voucher is apply---------------//
function getAllVoucherIsApply(){
    $.ajax({
        type: "GET",
        url: "/app/allItemVoucherIsApply"
    }).done(function (vouchers){
        let content = "<a class=\"change-action\" href=\"\">Đổi bàn</a>" +
                      "<a class=\"merge-action\" href=\"\">Gộp bàn</a>";
        for (let i = vouchers.length-1; i >= 0; i--) {
            content += `
                         <a class="merge-action" href=""><i class="fas fa-tags">Giảm ${vouchers[i].percent}%</i></a>
                `;
        }
        $(".table-action").html(content);
    })
}
getAllVoucherIsApply();
//---------- Get Voucher is apply---------------//

//----------Get Product By Id-------------------//


//----------Set Up Product---------------------//

function adToOrder(productID){

}

//----------Set Up Product---------------------//
function w3AddClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    if (arr1.indexOf(arr2[i]) == -1) {element.className += " " + arr2[i];}
  }
}

function w3RemoveClass(element, name) {
  var i, arr1, arr2;
  arr1 = element.className.split(" ");
  arr2 = name.split(" ");
  for (i = 0; i < arr2.length; i++) {
    while (arr1.indexOf(arr2[i]) > -1) {
      arr1.splice(arr1.indexOf(arr2[i]), 1);     
    }
  }
  element.className = arr1.join(" ");
}


// Add active class to the current button (highlight it)
let header = document.getElementById("myDiv")
let btns = header.getElementsByClassName("btn")
for(let i = 0; i < btns.length; i++){
    btns[i].addEventListener("click", function(){
        let current = document.getElementsByClassName("active")
        current[0].className = current[0].className.replace(" active", "")
        this.className += " active"
    })
}

  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });


(function ($, window, document, underfined) {
  /* Default Options */
    var defaults = {
        cart: [],
        addtoCartClass: '.sc-add-to-cart',
        cartProductListClass: '.cart-products-list',
        totalCartCountClass: '.total-cart-count',
        totalCartCostClass: '.total-cart-cost',
        showcartID : '#show-cart',
        itemCountClass : '.item-count'
    };

    function Item(name, price, count) {
        this.name = name;
        this.price = price;
        this.count = count;
    }
    /*Constructor function*/
    function simpleCart(domEle, options) {

        /* Merge user settings with default, recursively */
        this.options = $.extend(true, {}, defaults, options);
        //Cart array
        this.cart = [];
        //Dom Element
        this.cart_ele = $(domEle);
        //Initial init function
        this.init();
    }


    /*plugin functions */
    $.extend(simpleCart.prototype, {
        init: function () {
            this._setupCart();
            this._setEvents();
            this._loadCart();
            this._updateCartDetails();
        },
        _setupCart: function () {
            this.cart_ele.addClass("cart-grid panel panel-defaults");
            this.cart_ele.append("<div class='panel-heading cart-heading'><div class='total-cart-count'>Your Cart 0 items</div><div class='spacer'></div><i class='fa fa-rupee total-cart-cost'>0</i><div></div></div>")
            this.cart_ele.append("<div class='panel-body cart-body'><div class='cart-products-list' id='show-cart'><!-- Dynamic Code from Script comes here--></div></div>")
            this.cart_ele.append("<div class='cart-summary-container'>\n\
                                <div class='cart-offer'></div>\n\
                                        <div class='cart-total-amount'>\n\
                                            <div>Total</div>\n\
                                            <div class='spacer'></div>\n\
                                            <div><i class='fa fa-rupee total-cart-cost'>0</i></div>\n\
                                            </div>\n\
                                            <div class='cart-checkout'>\n\
                                            <form action='#'>\n\
                                                <button type='submit' class='btn btn-primary'>Proceed To Checkout</button>\n\
                                            </form>\n\
                                        </div>\n\
                                 </div>");
        },
        _addProductstoCart: function () {
        },
        _updateCartDetails: function () {
            var mi = this;
            $(this.options.cartProductListClass).html(mi._displayCart());
            $(this.options.totalCartCountClass).html("This Table has " + mi._totalCartCount() + " items");
            $(this.options.totalCartCostClass).html(mi._totalCartCost());
        },
        _setCartbuttons: function () {

        },
        _setEvents: function () {
            var mi = this;
            $(this.options.addtoCartClass).on("click", function (e) {
                e.preventDefault();
                var name = $(this).attr("data-name");
                var cost = Number($(this).attr("data-price"));
                mi._addItemToCart(name, cost, 1);
                mi._updateCartDetails();
            });
            
            $(this.options.showcartID).on("change", this.options.itemCountClass, function (e) {
                var ci = this;
        e.preventDefault();
        var count = $(this).val();
        var name = $(this).attr("data-name");
        var cost = Number($(this).attr("data-price"));
        mi._removeItemfromCart(name, cost, count);
        mi._updateCartDetails();
    });

        },
        /* Helper Functions */
        _addItemToCart: function (name, price, count) {
            for (var i in this.cart) {
                if (this.cart[i].name === name) {
                    this.cart[i].count++;
                    this.cart[i].price = price * this.cart[i].count;
                    this._saveCart();
                    return;
                }
            }
            var item = new Item(name, price, count);
            this.cart.push(item);
            this._saveCart();
        },
        _removeItemfromCart: function (name, price, count) {
            for (var i in this.cart) {
                if (this.cart[i].name === name) {
                    var singleItemCost = Number(price / this.cart[i].count);
                    this.cart[i].count = count;
                    this.cart[i].price = singleItemCost * count;
                    if (count == 0) {
                        this.cart.splice(i, 1);
                    }
                    break;
                }
            }
            this._saveCart();
        },
        _clearCart: function () {
            this.cart = [];
            this._saveCart();
        },
        _totalCartCount: function () {
            return this.cart.length;
        },
        _displayCart: function () {
            var cartArray = this._listCart();
            console.log(cartArray);
            var output = "";
            if (cartArray.length <= 0) {
                output = "<h4>Your table is empty</h4>";
            }
            for (var i in cartArray) {
                output += "<div class='cart-each-product'>\n\
                       <div class='name'>" + cartArray[i].name + "</div>\n\
                       <div class='quantityContainer'>\n\
                            <input type='number' class='quantity form-control item-count' data-name='" + cartArray[i].name + "' data-price='" + cartArray[i].price + "' min='0' value=" + cartArray[i].count + " name='number'>\n\
                       </div>\n\
                       <div class='quantity-am'><i class='fa fa-rupee'>" + cartArray[i].price + "</i></div>\n\
                       </div>";
            }
            return output;
        },
        _totalCartCost: function () {
            var totalCost = 0;
            for (var i in this.cart) {
                totalCost += this.cart[i].price;
            }
            return totalCost;
        },
        _listCart: function () {
            var cartCopy = [];
            for (var i in this.cart) {
                var item = this.cart[i];
                var itemCopy = {};
                for (var p in item) {
                    itemCopy[p] = item[p];
                }
                cartCopy.push(itemCopy);
            }
            return cartCopy;
        },
        _calGST: function () {
            var GSTPercent = 18;
            var totalcost = this.totalCartCost();
            var calGST = Number((totalcost * GSTPercent) / 100);
            return calGST;
        },
        _saveCart: function () {
            localStorage.setItem("shoppingCart", JSON.stringify(this.cart));
        },
        _loadCart: function () {
            this.cart = JSON.parse(localStorage.getItem("shoppingCart"));
            if (this.cart === null) {
                this.cart = [];
            }
        }
    });
    /* Defining the Structure of the plugin 'simpleCart'*/
    $.fn.simpleCart = function (options) {
        return this.each(function () {
            $.data(this, "simpleCart", new simpleCart(this));
            console.log($(this, "simpleCart"));
        });
    };

                $(document).ready(function () {
                $('#cart').simpleCart();
            });

})(jQuery, window, document);

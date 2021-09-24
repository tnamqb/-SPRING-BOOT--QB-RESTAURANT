//----------Get All Item In Client Page-----------//
function getAllItem(){
    $.ajax({
        type: "GET",
        url: "/app/allItem"
    }).done(function (product){
        let content = "";
        for (let i = product.length-1; i >= 0; i--) {
            content += `
                        <input type="hidden" id="id_product" value="${product[i].productId}">
                        <div class="drink-container specials">
                            <img src="/uploads/${product[i].image}" alt="${product[i].productName}">
                            <div class="overlay">                 
                                <div class="text">${product[i].productName}</div>
                                 <div class="text mt-3"><small>${(product[i].price).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</small></div>  
                                
                                <button class="button-overlay" onclick="createOrderDetail(${product[i].productId},${product[i].price})">Đặt món</button>
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
                        <input type="hidden" id="id_product" value="${product[i].productId}">
                        <div class="drink-container specials">
                            <img src="/uploads/${product[i].image}" alt="${product[i].productName}">
                            <div class="overlay">
                                <div class="text">${product[i].productName}</div>
                                <div class="text mt-3"><small>${(product[i].price).toLocaleString('vi', {style : 'currency', currency : 'VND'})}</small></div>
                                <button class="button-overlay" onclick="createOrderDetail(${product[i].productId},${product[i].price})" >Đặt món</button>
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
        let content =   "<a class=\"change-action\" href='#' onclick='showModalChange()'><i class=\"fas fa-exchange-alt\">Đổi bàn</i></a>" +
                        "<a class=\"merge-action\" href='#' onclick='getAllDeskMerge()'><i class=\"fas fa-object-ungroup\" >Gộp bàn</i></a>"+
                        "<a class=\"merge-action\" href='#' onclick='showCutModal()'><i class=\"fas fa-cut\">Tách bàn</i></a>";
        for (let i = vouchers.length-1; i >= 0; i--) {
            content += `
                         <input id="discount-percent" type="hidden" value="${vouchers[i].percent}">
                         <a class="merge-action" href="#" onclick="subDiscount()"><i class="fas fa-tags">Giảm ${vouchers[i].percent}%</i></a>
                `;
        }
        $(".table-action").html(content);
    })
}
getAllVoucherIsApply();
//---------- Get Voucher is apply---------------//

//----------Get Product By Id-------------------//

function createOrderDetail(id,price) {
    let product_id = id;
    let product_price = price;
    let order_id = $('#id-order').val();

    let newOrder = {
        orderId: order_id,
    }

    let newProduct = {
        productId: product_id,
    }

    let newOrderDetail = {
        productPrice: product_price,
        order: newOrder,
        product: newProduct,
        amount: 0,
        status: true
    }


    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        data: JSON.stringify(newOrderDetail),
        url: `/app/createOrderDetail`,
        }).done(function () {
            drawListOrderDetail(order_id);
    })
}


//---------------Get All Order Detail-----------//
function drawListOrderDetail(id) {
    $.ajax({
        type: "GET",
        url: `/app/getOrderDetailByOrderID/${id}`,
    }).done(function (orderDetails){
        let content = "";
        let content2 = `    
                    <div class="d-flex justify-content-between pr-1 pl-1 pb-0">
                        <p>Tạm tính</p>
                        <p id="provisional">0 đ</p>
                    </div>
                    <div class="d-flex justify-content-between pr-1 pl-1 pb-0" style="height: 10px">
                        <p>Khuyến mãi</p>
                        <input type="hidden" id="voucher_id" value="">
                        <p id="voucher-value">0 đ</p>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between pr-1 pl-1 pb-0">
                            <p>Thành tiền</p>
                            <input hidden id="total" value="">
                            <p id="total-after-discount">0 đ</p>
                    </div>
            `;
        if (orderDetails == undefined || orderDetails == null) {
            $(".bill-container").html("");
            $(".panel-body").html(content2);
        }
        else if (orderDetails.length > 0){
            let provisional = 0;
            for (let i = orderDetails.length-1; i >= 0; i--) {
                content += `
                       <div class="sub__bill">
                            <input type="hidden" id="id-order-detail" value="${orderDetails[i].orderDetailId}">
                            <input type="hidden" id="sub-id-product" value="${orderDetails[i].product.productId}"> 
                            <input type="hidden" id="sub-product-price" value="${orderDetails[i].productPrice}">
                            <input type="hidden" id="sub-product-name" value="${orderDetails[i].product.productName}">
                            <input type="hidden" id="sub-product-amount" value="${orderDetails[i].amount}">
                            <div class="sub__bill--name">${orderDetails[i].product.productName}
                            </div>
                            <div class="sub__bill--quantity"><i class="fas fa-minus-circle" onclick="reduceProduct(${orderDetails[i].orderDetailId})"  style="color: darkgrey"></i>
                                <h5 class="" style="margin: 0; font-size: .9rem">${orderDetails[i].amount}</h5><i class="fas fa-plus-circle" onclick="increaseProduct(${orderDetails[i].orderDetailId})" style="color: darkgrey"></i>
                            </div>
                            <div>
                                <h5 style="font-size: .8rem" class="sub__bill--price">${(orderDetails[i].productPrice.toLocaleString('vi', {style : 'currency', currency : 'VND'}))}</h5>
                            </div>
                            <div title="Xóa món" class="sub__bill-delIcon"><i class="fa fa-trash mb-1 text-danger" onclick="deleteOrderDetail(${orderDetails[i].orderDetailId})"></i></div>
                       </div>  
                `;
                provisional += parseInt(`${(orderDetails[i].productPrice)}`);
            }
            let discount = $('#voucher_id').val();
            if (!(discount > 0)) {
                discount = 0;
            }
            let total = provisional-(provisional*discount/100);
            let content1 = `    
                    <div class="d-flex justify-content-between pr-1 pl-1 pb-0">
                        <p>Tạm tính</p>
                        <p id="provisional">${(provisional.toLocaleString('vi', {style : 'currency', currency : 'VND'}))}</p>
                    </div>
                    <div class="d-flex justify-content-between pr-1 pl-1 pb-0" style="height: 10px">
                        <p>Khuyến mãi</p>
                        <input type="hidden" id="voucher_id" value="">
                        <p id="voucher-value"></p>
                    </div>
                    <hr>
                    <div class="d-flex justify-content-between pr-1 pl-1 pb-0" id="subTotal">
                            <p>Thành tiền</p>
                            <input type="hidden" id="clicks-value" value="">
                            <input hidden id="total" value="${total}">
                            <p id="total-after-discount">${(total.toLocaleString('vi', {style : 'currency', currency : 'VND'}))}</p>
                    </div>
            `;
            $(".bill-container").html(content);
            $(".panel-body").html(content1);
        }
    }).fail(function (){
        $(".bill-container").html("");
    })
}
//---------------Get All Order Detail-----------//


//--------------------Get discount-------------//
let clicks = 0;
function subDiscount(){
    clicks += 1;
    $('#clicks-value').val(clicks);
    let count = $('#clicks-value').val(clicks);
    let total = $('#total').val();
    let discount = $('#discount-percent').val();
    let discountMoney = discount*total/100;
    let totalPrice = (total-discountMoney);
    $('#voucher-value').text(`${(discountMoney.toLocaleString('vi', {style : 'currency', currency : 'VND'}))}`);
    if (count >= 1) {
        let content4 = `
                <p>Thành tiền</p>
                <input hidden id="total" value="${totalPrice}">
                <p id="total-after-discount">${(totalPrice).toLocaleString('vi', {style: 'currency', currency: 'VND'})}</p>
                `;
        $('#subTotal').html(content4);
    }
}
//--------------------Get discount-------------//



//-------------------- Create Bill-------------//
function createBill(){
    let idOrder = $('#id-order').val();
    let idTable = $('#idTableMerge').val();
    let billTime = getToday();
    let totalPrice = parseFloat($("#total-after-discount").text());
    let newBill = {
        billTime : billTime,
        billTotal : totalPrice,
    }
    Swal.fire({
        title: 'Xác nhận thanh toán ?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
        denyButtonText :`Hủy`,
        confirmButtonText: 'Đồng ý!'
    }).then((result) => {
        if (result.isConfirmed){
            $.ajax({
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: "POST",
                data: JSON.stringify(newBill),
                url: `/app/createBill`,
            }).done((resp) =>{
                newBill = resp;
                $.ajax({
                    type: "GET",
                    url: `/app/getOrderDetailByOrderID/${idOrder}`,
                }).done(function (oderDetails){
                    for (let i = 0; i < oderDetails.length; i++){
                        let newBillDetail = {
                            amount : oderDetails[i].amount,
                            productPrice : oderDetails[i].productPrice,
                            productName: oderDetails[i].product.productName,
                            bill :{
                                billId : newBill.billId
                            },
                        }
                        $.ajax({
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            type: "POST",
                            data: JSON.stringify(newBillDetail),
                            url: `/app/createBillDetail/${idTable}`,
                        }).done(function (){
                            getAllDesk();
                            App.showSuccessAlert("Thanh toán thành công!!");
                            $('#provisional').text("");
                            $('#voucher-value').text("");
                            $('#total-after-discount').text("");
                            $('.bd-example-modal-sm').modal('hide');
                            $('#modalDeskChange').modal('hide');
                            $('#modalQuickView').modal('hide');
                        })
                    }
                })
            }).fail(function (){
                App.showErrorAlert("Đã xảy ra lỗi!")
            })
        }
    })
}
//-------------------- Create Bill-------------//


//----------------Delete OrderDetail-----------//
function deleteOrderDetail(orderDetailId) {
    Swal.fire({
        title: 'Bạn có muốn hủy món này?',
        text: "Sau khi hủy sẽ không phục hồi!",
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
        denyButtonText :`Hủy`,
        confirmButtonText: 'Đồng ý!'
    }).then((result) => {
        if (result.isConfirmed){
            $.ajax({
                type : "DELETE",
                url : `/app/deleteOrderDetail/${orderDetailId}`,
                data : JSON.stringify(orderDetailId)
            }).done(function (){
                let idOrder = $('#id-order').val();
                drawListOrderDetail(idOrder);
                App.showSuccessAlert("Đã hủy thành công!")
            }).fail(function (){
                App.showErrorAlert("Đã xảy ra lỗi!")
            })
        }
    })
}
//----------------Delete OrderDetail-----------//


//----------------Increase Product-------------//
function increaseProduct(id){
    $.ajax({
        type: "PUT",
        url: `/app/increaseProduct/${id}`,
        data : JSON.stringify(id)
    }).done(function () {
        let idOrder = $('#id-order').val();
        drawListOrderDetail(idOrder);
    }).fail(()=>{
        App.showErrorAlert("Lỗi ! Không tăng số lượng được!!");
    })
}
//----------------Increase Product-------------//


//----------------Reduce Product---------------//
function reduceProduct(id){
    $.ajax({
        type: "PUT",
        url: `/app/reduceProduct/${id}`,
        data : JSON.stringify(id)
    }).done(function () {
        let idOrder = $('#id-order').val();
        drawListOrderDetail(idOrder);
    }).fail(()=>{
        App.showErrorAlert("Số lượng không thể nhỏ hơn 1!!");
    })
}
//----------------Reduce Product---------------//


function getToday(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}

function getTime(){
    let time = new Date();
    let hh = time.getHours();
    let mm = time.getMinutes();
    let ss = time.getSeconds();
    return `${hh}:${mm}:${ss}`;
}


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


let header = document.getElementById("myDiv")
let btns = header.getElementsByClassName("btn")
for(let i = 0; i < btns.length; i++){
    btns[i].addEventListener("click", function(){
        let current = document.getElementsByClassName("active")
        current[0].className = current[0].className.replace(" active", "")
        this.className += " active"
    })
}

  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();

      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
          window.location.hash = hash;
      });
    }
  });


(function ($, window, document, underfined) {
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
        });
    };

                $(document).ready(function () {
                $('#cart').simpleCart();
            });

})(jQuery, window, document);

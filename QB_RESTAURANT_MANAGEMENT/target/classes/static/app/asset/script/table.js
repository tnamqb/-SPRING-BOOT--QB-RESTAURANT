
//-------------Hiển thị bàn------------//
function getAllDesk(){
    $.ajax({
        type: "GET",
        url: "/allDesk"
    }).done(function (desks){
        let content = "";
        for (let i = 0; i < desks.length; i++) {
            content += `
                    <div class="table-container">${desks[i].hidden ?
                        '' :
                        `<div class="table-infor"><p>${desks[i].tableName}
                               ${desks[i].book && desks[i].book !== (null +"h "+ null) ?
                                `<span style="color: red">(Đặt lúc ${desks[i].book})</span>` :
                                ''}
                                </p>
                            <div class="table-img">${desks[i].custom ?
                                '<img src="/app/asset/img/table1.jpg">' :
                                '<img src="/app/asset/img/table2.jpg">'}
                                        <div class="portfolio-info">${desks[i].custom ?
                                        '<p style="color: red; font-weight:bold;">Exist</p>' :
                                        '<p style="color: blue; font-weight:bold;">Empty</p>'}
                                        <div class="portfolio-links">
                                        <a href="#" data-toggle="modal" onclick="getDesk(${desks[i].custom}, ${desks[i].tableId})"><i class="fas fa-eye fa-sm"></i></a>
                                        </div>
                                    </div>
                            </div>
                        </div>`}
                    </div>
                `;
        }
        $("#show").html(content);
    })
}
getAllDesk();


//-------------Hiển thị bàn------------//

function getDesk(custom, tableId) {
    $.ajax({
        type: "GET",
        url: `/tableBook/${tableId}`,
        success: function (desk) {
            $('#tableName').text(desk.tableName);
        }
    });
    if (!custom) {
        Swal.fire({
            title: 'Bạn có muốn đổi bàn thành có khách?',
            icon: 'warning',
            showDenyButton: true,
            confirmButtonColor: '#3085d6',
            denyButtonColor: '#d33',
            denyButtonText :`Hủy`,
            confirmButtonText: 'Đồng ý!'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type : "PUT",
                    url : `/tableCustom/${tableId}`
                }).done(function () {
                    getAllDesk();
                    Swal.fire(
                        'Đổi thành công!',
                        'Bạn có thể order món ăn.',
                        'success'
                    ).then(() => {
                        $('#modalQuickView').modal('show');
                        $('#idTableChange').val(tableId);
                        $('#idTableMerge').val(tableId);
                        $.ajax({
                            type: "GET",
                            url: `/tableBook/${tableId}`,
                            success: function (desk) {
                                $('#tableChange').text(desk.tableName);
                            }
                        });
                        $.ajax({
                            type: "GET",
                            url: "/deskChange"
                        }).done(function (desks){
                            let content =   "";
                            for (let i = 0; i < desks.length; i++) {
                                if (desks[i].book === (null +"h "+ null) || desks[i].book == null){
                                    content += `
                                <div class="table-container">
                                    <div class="table-infor">
                                        <p>${desks[i].tableName}</p> 
                                        <div class="table-image">
                                            <input type="hidden" id="idTableNewChange" value="${desks[i].tableId}">
                                            <a href="#" onclick="changeDesk()"><img src="/app/asset/img/table2.jpg"></a>
                                        </div>
                                    </div>
                                </div>
                                `;
                                }
                            }
                            $("#tableNewChange").html(content);
                        });
                    });
                    let newDesk = {
                        tableId : tableId
                    }
                    let time = new Date();
                    let newOrder = {
                        orderTime : time,
                        desk : newDesk
                    }
                    $.ajax({
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        type: "POST",
                        url: "/app/createOrder",
                        data: JSON.stringify(newOrder),
                    }).done(function (order){
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
                        $('#id-order').val(order.orderId);
                        $(".bill-container").html("");
                        $(".panel-body").html(content2);
                    })
                });
            }
        })
    } else {
        $('#modalQuickView').modal('show');
        $('#idTableChange').val(tableId);
        $('#idTableMerge').val(tableId);
        $.ajax({
            type: "GET",
            url: `/app/getOrder/${tableId}`
        }).done(function (order) {
            $.ajax({
                type: "GET",
                url: `/tableBook/${tableId}`,
                success: function (desk) {
                    $('#tableChange').text(desk.tableName);
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
                    $(".bill-container").html("");
                    $(".panel-body").html(content2);
                }
            });
            $.ajax({
                type: "GET",
                url: "/deskChange"
            }).done(function (desks){
                let content = "";
                for (let i = 0; i < desks.length; i++) {
                    if (desks[i].book === (null +"h "+ null) || desks[i].book == null){
                        content += `
                                <div class="table-container">
                                    <div  class="table-infor">
                                        <p>${desks[i].tableName}</p> 
                                        <div class="table-image">
                                            <input type="hidden" id="idTableNewChange" value="${desks[i].tableId}">
                                            <a href="#" onclick="changeDesk(${desks[i].tableId})"><img src="/app/asset/img/table2.jpg"></a>
                                        </div>
                                    </div>
                                </div>
                            `;
                    }
                }
                $("#tableNewChange").html(content);
            });
           $("#id-order").val(order.orderId);
           let id = order.orderId;
            drawListOrderDetail(id);
        })
    }
}

function changeDesk(idNewTableChange) {
        let idDeskChange = $('#idTableChange').val();
        Swal.fire({
        title: 'Bạn có muốn đổi bàn ?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
        denyButtonText :`Hủy`,
        confirmButtonText: 'Đồng ý!'
    }).then((result) => {
        if (result.isConfirmed){
            $.ajax({
                type: "PUT",
                data: {'id1': idDeskChange, 'id2': idNewTableChange},
                url: "/deskChange"
            }).done(function (){
                getAllDesk();
                App.showSuccessAlert("Đổi bàn thành công!!");
                $('.bd-example-modal-sm').modal('hide');
                $('#modalDeskChange').modal('hide');
                $('#modalQuickView').modal('hide');
            }).fail(function (){
                App.showErrorAlert("Đã xảy ra lỗi!")
            })
        }
    })
}

//----------------Hiển thị bàn muốn gộp----------------//
function getAllDeskMerge(){
    let id = $('#idTableChange').val();
    $.ajax({
        type: "GET",
        url: `/getAllDeskMerge/${id}`,
    }).done(function (desks){
        let content = "";
        for (let i = 0; i < desks.length; i++) {
            content += `
                <div class="table-container">
                    <div  class="table-infor">
                        <p>${desks[i].tableName}</p> 
                        <div class="table-image">
                            <input type="hidden" id="idTableNewMerge" value="${desks[i].tableId}">
                            <a href="#" onclick="mergeDesk(${desks[i].tableId})"><img src="/app/asset/img/table1.jpg"></a>
                        </div>
                    </div>
                </div>
                  `;
            }
        $('.bg-example-modal-sm').modal('show');
        $("#tableNewMerge").html(content);
    })
}
//----------------Hiển thị bàn muốn gộp----------------//

function mergeDesk(idNewDeskMerge) {
    let idDeskMerge = $('#idTableChange').val();
    Swal.fire({
        title: 'Bạn có muốn gộp bàn ?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
        denyButtonText :`Hủy`,
        confirmButtonText: 'Đồng ý!'
    }).then((result) => {
        if (result.isConfirmed){
            $.ajax({
                type: "PUT",
                data: {'id1': idDeskMerge, 'id2': idNewDeskMerge},
                url: "/deskMerge"
            }).done(function (){
                getAllDesk();
                App.showSuccessAlert("Gộp bàn thành  thành công!!");
                $('.bg-example-modal-sm').modal('hide');
                $('#modalDeskChange').modal('hide');
                $('#modalQuickView').modal('hide');
            }).fail(function (){
                App.showErrorAlert("Đã xảy ra lỗi!")
            })
        }
    })
}

//---------------Tách bàn----------------//
function showCutModal(){
    let idOrder = $('#id-order').val();
    $.ajax({
        type: "GET",
        url: `/app/getOrderDetailByOrderID/${idOrder}`,
    }).done(function (orderDetails){
        let content = "";
         if (orderDetails.length > 0){
            for (let i = orderDetails.length-1; i >= 0; i--) {
                content += `
                     <tr>
                        <input type="hidden" id="productIdSplit-${i}" value="${orderDetails[i].product.productId}">
                        <td scope="row">${orderDetails[i].product.productName}</td>
                        <td class="quantity">
                            <button><i class="fa fa-minus-circle" onclick=minusProduct(${i},${orderDetails[i].product.price})></i></button>
                            <span class="split-quantity" id="split-quantity-${i}" >0</span>
                            <button><i class="fa fa-plus-circle" onclick=plusProduct(${i},${orderDetails[i].amount},${orderDetails[i].product.price})></i></button><span>  /${orderDetails[i].amount}</span>
                        </td>
                        <td class="money"><span id="total-price-${i}" >0</span></td>
                    </tr>
                `;
            }
            $('#cutProductModal').modal('show');
            $("#orderDetail-table tbody").html(content);
            $('#idOrderBefore').val(idOrder);
        }
    }).fail(function (){
        App.showErrorAlert("Bàn này chưa có món!")
    })
}
//----------------------Tách bàn------------//

function getToday(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
}

function up(max) {
    document.getElementById("myNumber").value = parseInt(document.getElementById("myNumber").value) + 1;
    if (document.getElementById("myNumber").value >= parseInt(max)) {
        document.getElementById("myNumber").value = max;
    }
}

function down(min) {
    document.getElementById("myNumber").value = parseInt(document.getElementById("myNumber").value) - 1;
    if (document.getElementById("myNumber").value <= parseInt(min)) {
        document.getElementById("myNumber").value = min;
    }
}

function showModalChange() {
    $('.bd-example-modal-sm').modal('show');
}

function minusProduct(i,price){
    let quantity = $(`#split-quantity-${i}`).text();
    if (quantity <= 0 ){
        App.showErrorAlert("Số lượng không thể nhỏ hơn 0");
        $(`#split-quantity-${i}`).text(0);
    }else{
        --quantity;
    }
    let totalPrice = quantity*price;
    $(`#split-quantity-${i}`).text(quantity);
    $(`#total-price-${i}`).text(totalPrice);
}

function plusProduct(i,max,price){
    let quantity = $(`#split-quantity-${i}`).text();
    if (max <= quantity ){
        App.showErrorAlert("Số lượng không thể lớn hơn " + max );
        $(`#split-quantity-${i}`).text(max);
    }else{
        ++quantity;
    }
    let totalPrice = quantity*price;
    $(`#split-quantity-${i}`).text(quantity);
    $(`#total-price-${i}`).text(totalPrice);
}

function getAllCutModal(){
    let idOrderBefore =  $('#idOrderBefore').val();
    let newDesk = {
        tableId : 10000
    }
    let time = new Date();
    let newOrder = {
        orderTime : time,
        desk : newDesk
    }
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: "POST",
        url: "/app/createOrder",
        data: JSON.stringify(newOrder),
    }).done(function (order){
        let orderId = order.orderId;
        $('#idNewOrder').val(orderId);
        let rowTr = $("#orderDetail-table tbody tr").length;
        for (let i = 0; i < rowTr; i++){
            let amount = $(`#split-quantity-${i}`).text();
            let productId = $(`#productIdSplit-${i}`).val();
            let productPrice = $(`#total-price-${i}`).text();
            if (amount > 0) {
                let newOrderDetail = {
                    amount: amount,
                    product: {
                        productId: productId,
                    },
                    status: false,
                    order: {
                      orderId: orderId
                    },
                    productPrice: productPrice,
                }
                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    type: "POST",
                    url: "/splitOrderDetail",
                    data: JSON.stringify(newOrderDetail),
                }).done(function (){
                    let idTable = $('#idTableChange').val();
                    $.ajax({
                        type: "GET",
                        url: `/getAllDeskSplit/${idTable}`,
                    }).done(function (desks){
                        let content = "";
                        for (let i = 0; i < desks.length; i++) {
                            if (desks[i].book === (null +"h "+ null) || desks[i].book == null){
                                content += `
                                <div class="table-container">${desks[i].hidden ?
                                    '' :
                                    `<div class="table-infor"><p>${desks[i].tableName}</p>
                                        <div class="table-img">${desks[i].custom ?
                                        `<a href="#" onclick="deskForwardToDeskExist(${idTable},${desks[i].tableId})"><img src="/app/asset/img/table1.jpg"></a>` :
                                        `<a href="#" onclick="deskForwardToDeskEmpty(${orderId},${desks[i].tableId})"><img src="/app/asset/img/table2.jpg"></a>`}
                                        </div>
                                    </div>`}
                                </div>`;
                            }
                        }
                        $('#cutProductModal').modal('hide');
                        $("#tableNewMerge").html(content);
                        $('.bg-example-modal-sm').modal('show');
                    })
                })
            }
        }
    });
}

function deskForwardToDeskExist(id1,id2){

}

function deskForwardToDeskEmpty(id1,id2){
    Swal.fire({
        title: 'Bạn có muốn tách bàn ?',
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#d33',
        denyButtonText :`Hủy`,
        confirmButtonText: 'Đồng ý!'
    }).then((result) => {
        if (result.isConfirmed){
            $.ajax({
                type: "PUT",
                data: {'id1': id1, 'id2': id2},
                url: "/deskSplitOrder"
            }).done(function (){
               alert("123456");
            }).fail(function (){
                App.showErrorAlert("Đã xảy ra lỗi!")
            })
        }
    })
}






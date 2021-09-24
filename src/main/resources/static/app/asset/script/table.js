
//-------------Hiển thị bàn------------//
function getAllDesk(){
    $.ajax({
        type: "GET",
        url: "/allDesk"
    }).done(function (desks){
        let content = "";
        for (let i = 0; i < desks.length; i++) {
            content += `
                    <input hidden id="${desks[i].tableId}">
                    <div class="table-container">
                    <div class="table-infor"><p>${desks[i].tableName}</p>
                    <div class="table-img">
                    <div class="table-name"></div>
                    ${desks[i].book ?
                    '<div class="book"><p>Đặt</p></div>' :
                    ''} ${desks[i].status ?
                '<img src="/app/asset/img/table1.jpg">' :
                '<img src="/app/asset/img/table2.jpg">'}
                 <div class="portfolio-info">${desks[i].status ?
                '<p style="color: blue; font-weight:bold;">Empty</p>' :
                '<p style="color: red; font-weight:bold;">Exist</p>'}
                <div class="portfolio-links">
                <a href="#" data-toggle="modal" data-target="#modalQuickView"><i class="fas fa-eye fa-sm"></i></a>
                </div>
                </div>
                </div>
                            
                    </div>
                        </div>
                `;
        }
        $("#show").html(content);
    })
}
getAllDesk();

//-------------Hiển thị bàn------------//


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
const boxcat = document.querySelector('.scrollFilterBox.cat .box-selector') 
const boxsubcat = document.querySelector('.scrollFilterBox.subcat .box-selector') 
const boxfilterdata = document.querySelector('.productsDiv')

const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');

console.log("its",categoryParam);

// Check the corresponding category checkbox based on the category parameter
if (categoryParam) {
    const checkbox = document.querySelector(`.common-selector.cat[value="${categoryParam}"]`);
    if (checkbox) checkbox.checked = true;
}


fetch('/category')
  .then(res => res.json())
  .then(data=>{
    const categoryList = data.data
    console.log("catlist",categoryList)
    // const categoryData = <%= JSON.stringify(category) %>;
    let params = new URLSearchParams(document.location.search);
    let newid = params.get("category"); 
     console.log(newid);
  


    let html = ``

    categoryList.forEach(item => {
        let isChecked = '';
        console.log("newid", newid)
        console.log("ohhhhh",item.category_id)

        if(newid == item.category_id) {
            isChecked = 'checked';
        }


      html += `<div>
      <label><input type="checkbox" class="common-selector cat" value="${item.category_id}" ${isChecked}>  
      ${item.category_name}</label>
   </div>`
    });
    boxcat.innerHTML = html
  })

fetch('/subcategory')
  .then(res => res.json())
  .then(data=>{
    const subcategoryList = data.data
    console.log("subcatlist",subcategoryList)

    let html = ``

    subcategoryList.forEach(item => {
      html += `<div>
                <label><input type="checkbox" class="common-selector subcat" value="${item.subcategory_id}">
                ${item.subcategory_name}</label>
              </div>`
    });
    boxsubcat.innerHTML = html
  }) 


  filterData();
  function getFilter(className) {
    let filter = [];
    let commonSelector = document.querySelectorAll(`.${className}.common-selector:checked`);
    commonSelector.forEach((item) => {
        filter.push(item.value);
        console.log("line3", item.value);
    });
    console.log("filter", filter);
    return filter;
}

document.addEventListener('click', function(e){
    const target = e.target;
    console.log("lucky1", target);
    if(target.classList.contains('common-selector')) {
        const className = target.classList.contains('cat') ? 'cat' : 'subcat';
        filterData(className);
    }
});

// function filterData() {
//     const category = getFilter('cat');
//     const subcategory = getFilter('subcat');

//     $.ajax({
//         url: './allcat',
//         method: "GET",
//         data: {
//             category,
//             subcategory
//         },
//         success: function (result) {
//             let html = ``;
//             console.log("ooline", result);
//             if (result.message === 'Success') { // Use '===' for comparison
//                 const laptopdata = result.data;
//                 laptopdata.forEach((item) => {
//                     html += `
                  
//           <a href="/product/${item.shop_id}">

//                         <div class="product">
//                             <div class="imgDiv">
//                                 <img src="/images/${item.img_1}" alt="" />
//                             </div>
//                             <div class="prodContent">
//                                 <h6 class="prodName">${item.name}</h6>
//                                 <span class="priceSpan">
//                                     <p class="retailPrice">INR-${item.price}</p>
//                                     <p class="mrp">${item.mrp} INR</p>
//                                 </span>
//                                 <button class="addBtn">Add to cart</button>
//                             </div>
//                         </div>
//         </a>
//         `;
//                 });
//             } else {
//                 html += `
//                     <div class="product">
//                         <div class="prodContent">
//                             <h1>not found </h1>
//                         </div>
//                     </div>`;
//             }
//             boxfilterdata.innerHTML = html;
//         }
//     });
// }

// Define a Set to store already displayed shop_id values
const displayedShopIds = new Set();

function filterData() {
    const category = getFilter('cat');
    const subcategory = getFilter('subcat');

    $.ajax({
        url: './allcat',
        method: "GET",
        data: {
            category,
            subcategory
        },
        success: function (result) {
            let html = ``;
            console.log("ooline", result);
            if (result.message === 'Success') {
                const laptopdata = result.data;
                const provar = result.provar;
                laptopdata.forEach((item) => {
                    // Check if the shop_id has already been displayed
                    // if (!displayedShopIds.has(item.shop_id)) {
                        html += `
                        <a href="/product/${item.shop_id}">
                            <div class="product">
                                <div class="imgDiv">
                                    <img src="/images/${item.img_1}" alt="" />
                                </div>
                                <div class="prodContent">
                                    <h6 class="prodName">${item.name}</h6>
                                    <h6 class="prodDesc">${item.description}</h6>
                                    
                                    <span class="priceSpan">`

                                provar.forEach((pro)=>{
                                    if(item.shop_id==pro.shop_id){  
                                        html += `
                                        <p class="retailPrice">INR-${pro.price}</p>
                                        <p class="mrp">${pro.mrp} INR</p>`
                                    }
                                    console.log("props", pro)
                                  
                                })
                                html +=`
                                        
                                       
                                    </span>
                                    <button class="addBtn">Add to cart</button>
                                </div>
                            </div>
                        </a>
                        `;
                        // Add the shop_id to the displayed set
                        // displayedShopIds.add(item.shop_id);
                    // }
                });
            } else {
                html += `
                <div class="product">
                    <div class="prodContent">
                        <h1>not found </h1>
                    </div>
                </div>`;
            }
            boxfilterdata.innerHTML = html;
        }
    });
}



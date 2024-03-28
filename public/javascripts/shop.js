const boxcat = document.querySelector('.scrollFilterBox.cat .box-selector') 
const boxsubcat = document.querySelector('.scrollFilterBox.subcat .box-selector') 
const boxfilterdata = document.querySelector('.productsDiv')

const urlParams = new URLSearchParams(window.location.search);
const categoryParam = urlParams.get('category');

// console.log("its",categoryParam);

// Check the corresponding category checkbox based on the category parameter
if (categoryParam) {
    const checkbox = document.querySelector(`.common-selector.cat[value="${categoryParam}"]`);
    if (checkbox) checkbox.checked = true;
}


fetch('/category')
  .then(res => res.json())
  .then(data=>{
    const categoryList = data.data
    // console.log("catlist",categoryList)
    // const categoryData = <%= JSON.stringify(category) %>;
    let params = new URLSearchParams(document.location.search);
    let newid = params.get("category"); 
    //  console.log(newid);
  


    let html = ``

    categoryList.forEach(item => {
        let isChecked = '';
        // console.log("newid", newid)
        // console.log("ohhhhh",item.category_id)

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

// fetch('/subcategory')
//   .then(res => res.json())
//   .then(data=>{
//     const subcategoryList = data.data

//     let html = ``

//     subcategoryList.forEach(item => {
//       html += `<div>
//                 <label><input type="checkbox" class="common-selector subcat" value="${item.subcategory_id}">
//                 ${item.subcategory_name}</label>
//               </div>`
//     });
//     boxsubcat.innerHTML = html
//   }) 


  filterData();
  function getFilter(className) {
    let filter = [];
    let commonSelector = document.querySelectorAll(`.${className}.common-selector:checked`);
    commonSelector.forEach((item) => {
        filter.push(item.value);
        // console.log("line3", item.value);
    });
    // console.log("filter", filter);
    return filter;
}

document.addEventListener('click', function(e){
    const target = e.target;
    console.log("input", target)
    if(target.classList.contains('common-selector')) {
        const className = target.classList.contains('cat') ? 'cat' : 'subcat';
        console.log("click to cat", className)
        filterData(className);
    }
});



function filterData() {
    const category = getFilter('cat');
    const subcategory = getFilter('subcat');

    console.log("dor",category)
    $.ajax({
        url: './allcat',
        method: "GET",
        data: {
            category,
            subcategory
        },
        success: function (result) {
        console.log('pp',result);
        console.log("sub", result.subData)

        const subData = result.subData;
        let subD = ``;
        subData.forEach((subd)=>{
            subD += `<div>
            <label><input type="checkbox" class="common-selector subcat" value="${subd.subcategory_id}">
            ${subd.subcategory_name}</label>
          </div>`
         boxsubcat.innerHTML = subD

        })

            let html = ``;
            // console.log("ooline", result);
            if (result.message === 'Success') {
                const laptopdata = result.data;
                const provar = result.provar;
                const variant = result.variant;
                // console.log("provar",provar)
                // console.log("variant",variant)
                laptopdata.forEach((item) => {
                //    console.log("item", item)
                        html += `
                        <a href="/product/${item.shop_id}">
                            <div class="product">
                                <div class="imgDiv">
                                    <img src="/images/${item.img_1}" alt="" />
                                </div>
                                <div class="prodContent">
                                    <div class="priceSpan">`

                                provar.forEach((pro)=>{
                                    if(item.shop_id==pro.shop_id){  
                         
                                        html += `
                                        <div class="spanChild">` 


                                        variant.forEach((vari)=>{
                                            if(pro.vid==vari.id){
                                                html += `
                                                <p class="variant">${vari.v_name}</p>
                                                <p class="variant">${vari.description}</p>`
                                            }
                                        })
                                       html += ` 
                                        </div>`;
                                        return;
                                    }
                                  
                                })
                                html +=`
                                        
                                       
                                    </div>
                                    
                                    <button class="addBtn">View Product</button>
                                </div>
                            </div>
                        </a>
                        `;
                    
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



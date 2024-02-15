const api_url = "/shopp";

async function getapi(url) {
  const response = await fetch(url);
  console.log(response);
  console.log("line1")
  var resultdata = await response.json();
  console.log("line2")
  var data = resultdata;
  console.log(data.shop);
  if (response) {
   
    console.log("this is category id"+response)
  }
//   show(data);
}

document.querySelectorAll('.category-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
         
        const categoryId = this.getAttribute('data-category-id');
        console.log("Category ID:", categoryId);
        
        fetch(`/shop/${categoryId}`)
            .then(response => response.text())
            .then(data => {
                console.log("Fetched HTML content:", data);
                
                // Replace the inner HTML of productsDiv with the fetched HTML content
                document.querySelector('.productsDiv').innerHTML = data;
            })
            .catch(error => console.error('Error fetching data:', error));
    });
});



document.querySelectorAll('.subcategory-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
         
        const subcategoryId = this.getAttribute('data-subcategory-id');
        console.log("sub-Category ID:", subcategoryId);
        
        fetch(`/shop/${subcategoryId}`)
            .then(response => response.text())
            .then(data => {
                console.log("Fetched HTML content:", data);
                
                // Replace the inner HTML of productsDiv with the fetched HTML content
                document.querySelector('.productsDiv').innerHTML = data;
            })
            .catch(error => console.error('Error fetching data:', error));
    });
});


// Function to fetch initial data
getapi(api_url);

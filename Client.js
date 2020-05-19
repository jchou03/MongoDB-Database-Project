var insert = document.getElementById("Insert")
insert.addEventListener('click', function(e){
    console.log("insert was clicked");

    fetch("/inserted", {method: 'POST'}).then(function(response){
        if(response.ok){
            
            

            console.log("successfully inserted");
            return;
        }
        throw new Error("request failed");
    })
    .catch(function(error){
        console.log(error)
    });
    
});


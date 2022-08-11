function removeDiacritics(text){
    var result = text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
    return result;
}


const statusPair = new Map([
    ["Not Threatened", "#02a028"],
    ["Naturally Uncommon", 	"#649a31"],
    ["Relict", "#99cb68"],
    ["Recovering", "#fecc33"],
    ["Declining", "#fe9a01"],
    ["Nationally Increasing", 	"#c26967"],
    ["Nationally Vulnerable", "#9b0000"],
    ["Nationally Endangered", 	"#660032"],
    ["Nationally Critical", "#320033"],
    ["Extinct", "black"],
    ["Data Deficient", "black"],
    
  ]);
function createBirdElement(primaryName, englishName, scientificName, order, family, otherNames, status, photoCredit, photoSource, lengthValue, lengthUnits, weightValue, weightUnits){

        const birdBox = document.createElement('article');
        const accentsRemovedMaoriName = removeDiacritics(primaryName);
        const statusColor = statusPair.get(status);
        birdBox.innerHTML= `
        <div class="image-half" style="background-image: url(${photoSource});">
        
        <h1>${primaryName}</h1>
        </div>
        <div id="${status}" style="background-color:${statusColor};" class = "status-banner"></div>
        <p> Scientific name: <span> ${scientificName} </span> </p>
        <p> English Name: <span> ${englishName}  </span> </p>
        <p> Status: <span> ${status}  </span> </p>
        <p> Order: <span> ${order} </span> </p>
        <p> Family: <span> ${family} </span> </p>
        <p> Other Names: <span> ${otherNames} </span> </p>
        <p> Photo credit: <span> ${photoCredit} </span> </p>
        <p> Length: <span> ${lengthValue}${lengthUnits} </span> </p>
        <p> Weight: <span> ${weightValue}${weightUnits} </span> </p>
        
        
        
    
    
    
        `
        const body = document.querySelector('main');
        body.append(birdBox);

    
        
        
    
    
    
    


}



async function loadAllBirds(){
    const body = document.querySelector('main');
    body.innerHTML = "";
    const BIRDS_URL = "nzbird.json";
    let response = await fetch(BIRDS_URL);
    if (!response.ok){
		console.error("Failed: " + response.status); // error handling
	}
    let birds = await response.json();
    for(let i = 0; i < birds.length; i++){
        let otherNames = birds[i].other_names;
        let otherNamesResult;
            for(let x = 0; x < otherNames.length; x++){
                otherNamesResult = otherNamesResult + otherNames[x] + ", ";
            }
            const lastIndexOfComma = otherNamesResult.lastIndexOf(',');
            otherNamesResult= otherNamesResult.slice(0, lastIndexOfComma);
            createBirdElement(birds[i].primary_name, birds[i].english_name, birds[i].scientific_name, birds[i].order, birds[i].family, otherNamesResult, birds[i].status, birds[i].photo.credit, birds[i].photo.source, birds[i].size.length.value, birds[i].size.length.units, birds[i].size.weight.value, birds[i].size.weight.units);

        }
        
    
}



async function loadBirdElementsBySearch(query, status, sort, family){
    console.log(query + status+ sort + family);
    const body = document.querySelector('main');
    body.innerHTML = "";
    const BIRDS_URL = "nzbird.json";
    let response = await fetch(BIRDS_URL);
    if (!response.ok){
		console.error("Failed: " + response.status); // error handling
	}
    let birds = await response.json();

    //low to high
    if(sort == "lengthLowHigh"){
        birds.sort(function(a, b) {
            return parseFloat(a.size.length.value) - parseFloat(b.size.length.value);
        });
    }

    //high to low
    if(sort == "lengthHighLow"){
        birds.sort(function(a, b) {
            return parseFloat(b.size.length.value) - parseFloat(a.size.length.value);
        });
    }

    if(sort == "weightLowHigh"){
        birds.sort(function(a, b) {
            return parseFloat(a.size.weight.value) - parseFloat(b.size.weight.value);
        });
    }


    //high to low
    if(sort == "weightHighLow"){
        birds.sort(function(a, b) {
            return parseFloat(b.size.weight.value) - parseFloat(a.size.weight.value);
        });
    }

    for(let i = 0; i < birds.length; i++){
        let otherNames = birds[i].other_names;
        let noDiacritics = removeDiacritics(birds[i].primary_name);
        if((noDiacritics.includes(query) || birds[i].english_name.includes(query) || birds[i].scientific_name.includes(query) || otherNames.includes(query)) && (birds[i].status == status || status == "Any") && (birds[i].family == family || family == "")){
            let otherNamesResult = "";
            for(let x = 0; x < otherNames.length; x++){
                otherNamesResult = otherNamesResult + otherNames[x] + ", ";
            }
            const lastIndexOfComma = otherNamesResult.lastIndexOf(',');
            otherNamesResult= otherNamesResult.slice(0, lastIndexOfComma);
            createBirdElement(birds[i].primary_name, birds[i].english_name, birds[i].scientific_name, birds[i].order, birds[i].family, otherNamesResult, birds[i].status, birds[i].photo.credit, birds[i].photo.source, birds[i].size.length.value, birds[i].size.length.units, birds[i].size.weight.value, birds[i].size.weight.units);

        }
        
    }
    
}





const filter = document.querySelector('form');
console.log(filter.elements['name'].value)
filter.addEventListener('submit', (event) => {
    
    event.preventDefault();
    const name = filter.elements['name'];
    const status = filter.elements['status'];

    let nameFilter = name.value;
    let statusFilter = status.value;
    let familyFilter = family.value;
    let sortFilter = sort.value;

    loadBirdElementsBySearch(nameFilter, statusFilter, sortFilter, familyFilter);

});

loadAllBirds();












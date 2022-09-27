const shrtInput= document.getElementById('shrt-input');
const orgInput= document.getElementById('org-input');

const genshort= document.getElementById('genshrt');
const genlong= document.getElementById('genlong');

const copyshorturl=document.getElementById('copyshorturl');
const copyshorttext=document.getElementById('copyshorttext');
const copyshortbtn=document.getElementById('copyshortbtn');

const copylongurl=document.getElementById('copylongurl');
const copylongtext=document.getElementById('copylongtext');
const copylongbtn=document.getElementById('copylongbtn');

//localstorage
const getStorage= ()=>{
    return JSON.parse(localStorage.getItem('short-links'));
}

const setStorage= (data)=>{
    const storage=getStorage();
    const array=[];
    array.push(data);
    if(!storage){
        localStorage.setItem('short-links',JSON.stringify(array));
    }
    else{
        storage.push(data);
        localStorage.setItem('short-links',JSON.stringify(storage));
    }
}

const findFromStorage=(shortlink)=>{
    const storage=getStorage();
    if(storage){
        const original= storage?.find(link=>link?.short===shortlink)?.original;
        if(original){
            return original;
        }
        else{
            return "INV"
        }        
    }
    else{
        alert('Shorten some links first!');
    }
}

//copytext
const copytextfunc= (value)=> {
    navigator.clipboard.writeText(value);
    alert("Copied the text: " + value);
}

//generate short link
genshort.addEventListener('click',()=>{
    console.log('clicked');
    const longlink= shrtInput.value;
    orgInput.value='';
    copylongurl.style.display="none";

    if(longlink.length>0){
        fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
            'Authorization': 'Bearer bfca27ac12566ec74ed17525a3fa1f2c13378f4f',
            'Content-Type': 'application/json'
        },
            body: JSON.stringify({ "long_url": longlink, "domain": "bit.ly"})
        })
        .then(res=>res.json())
        .then(data=>{
            copyshorturl.style.display="flex";
            copyshorttext.innerText=data.link||'No valid link inputted';
            if(copyshorttext.innerText!=='No valid link inputted'){
                setStorage({short:data.link,original:data.long_url});
            }
        })
        .catch(err=>{
            alert('Input Valid URL');
            copyshorturl.style.display="none";
            copyshorttext.innerText="";
        });
    }
})

//generate original link
genlong.addEventListener('click',()=>{
    const shortlink=orgInput.value;
    shrtInput.value='';
    copyshorturl.style.display="none";

    if (shortlink){
        const original=findFromStorage(shortlink);
    
        if(original.length>3){
            copylongurl.style.display="flex";
            copylongtext.innerText=original;
        }
        else{
            alert('Invalied Link');
        }   
    }
})

//copy nutton short link
copyshortbtn.addEventListener('click', ()=>copytextfunc(copyshorttext.innerText));
copylongbtn.addEventListener('click',()=>copytextfunc(copylongtext.innerText));
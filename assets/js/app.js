const cars = [
{id:1,make:"Porsche",model:"911 Carrera",year:2024,price:118900,mileage:8200,body:"Coupe",fuel:"Gasoline",transmission:"Automatic",location:"Los Angeles, CA",image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80"},
{id:2,make:"BMW",model:"M4 Competition",year:2023,price:82900,mileage:14600,body:"Coupe",fuel:"Gasoline",transmission:"Automatic",location:"Austin, TX",image:"https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"},
{id:3,make:"Mercedes-Benz",model:"C 300",year:2024,price:47900,mileage:9200,body:"Sedan",fuel:"Hybrid",transmission:"Automatic",location:"Miami, FL",image:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80"},
{id:4,make:"Toyota",model:"RAV4 Hybrid",year:2025,price:36900,mileage:4100,body:"SUV",fuel:"Hybrid",transmission:"Automatic",location:"Seattle, WA",image:"https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80"},
{id:5,make:"Tesla",model:"Model 3 Long Range",year:2024,price:42900,mileage:7800,body:"Sedan",fuel:"Electric",transmission:"Automatic",location:"San Diego, CA",image:"https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80"},
{id:6,make:"Honda",model:"Civic Touring",year:2023,price:28900,mileage:18900,body:"Sedan",fuel:"Gasoline",transmission:"CVT",location:"Chicago, IL",image:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80"},
{id:7,make:"Toyota",model:"Camry XSE",year:2022,price:27900,mileage:31200,body:"Sedan",fuel:"Gasoline",transmission:"Automatic",location:"Denver, CO",image:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80"},
{id:8,make:"Porsche",model:"Macan S",year:2023,price:71900,mileage:12100,body:"SUV",fuel:"Gasoline",transmission:"Automatic",location:"New York, NY",image:"https://images.unsplash.com/photo-1614200187524-dc4b892acf16?auto=format&fit=crop&w=900&q=80"},
{id:9,make:"BMW",model:"X5 xDrive40i",year:2024,price:68900,mileage:10400,body:"SUV",fuel:"Gasoline",transmission:"Automatic",location:"Boston, MA",image:"https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=900&q=80"}
];

const money = n => "$" + n.toLocaleString();
const favorites = JSON.parse(localStorage.getItem("autovistaFavorites") || "[]");

function updateFavoriteCount(){
  document.querySelectorAll("[data-favorites]").forEach(b=>{
    const badge=b.querySelector(".badge"); if(badge) badge.textContent=favorites.length;
  });
}
function toggleFavorite(id){
  const i=favorites.indexOf(id);
  if(i>=0) favorites.splice(i,1); else favorites.push(id);
  localStorage.setItem("autovistaFavorites",JSON.stringify(favorites));
  updateFavoriteCount();
  document.querySelectorAll(`[data-fav="${id}"]`).forEach(b=>b.classList.toggle("active",favorites.includes(id)));
}
function card(c){
 return `<article class="car-card"><div class="car-photo"><img src="${c.image}" alt="${c.make} ${c.model}" loading="lazy"><button class="fav ${favorites.includes(c.id)?"active":""}" data-fav="${c.id}" aria-label="Favorite">♡</button></div><div class="car-info"><div class="car-meta">${c.year} · ${c.mileage.toLocaleString()} miles · ${c.body}</div><div class="car-name">${c.make} ${c.model}</div><div class="car-meta">${c.location}</div><div class="car-price">${money(c.price)}</div><a class="text-link" href="car-details.html?id=${c.id}">View details →</a></div></article>`;
}
function bindFavorites(){
 document.querySelectorAll("[data-fav]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();e.stopPropagation();toggleFavorite(Number(b.dataset.fav));}));
 updateFavoriteCount();
}
function renderFeatured(){
 const el=document.querySelector("#featuredCars"); if(!el)return;
 el.innerHTML=cars.slice(0,6).map(card).join(""); bindFavorites();
}
function renderInventory(){
 const el=document.querySelector("#carList"); if(!el)return;
 const params=new URLSearchParams(location.search);
 const searchEl=document.querySelector("#filterSearch"), makeEl=document.querySelector("#filterMake"), bodyEl=document.querySelector("#filterBody"), priceEl=document.querySelector("#filterPrice"), yearEl=document.querySelector("#filterYear"), sortEl=document.querySelector("#sortCars");
 if(params.get("make")) makeEl.value=params.get("make");
 if(params.get("model")) searchEl.value=params.get("model");
 if(params.get("maxPrice")) priceEl.value=params.get("maxPrice");
 const draw=()=>{
   let list=cars.filter(c=>(!searchEl.value || `${c.make} ${c.model}`.toLowerCase().includes(searchEl.value.toLowerCase())) && (!makeEl.value||c.make===makeEl.value) && (!bodyEl.value||c.body===bodyEl.value) && (!priceEl.value||c.price<=Number(priceEl.value)) && (!yearEl.value||c.year>=Number(yearEl.value)));
   if(sortEl.value==="price-low") list.sort((a,b)=>a.price-b.price);
   if(sortEl.value==="price-high") list.sort((a,b)=>b.price-a.price);
   if(sortEl.value==="year-new") list.sort((a,b)=>b.year-a.year);
   document.querySelector("#resultCount").textContent=`${list.length} car${list.length!==1?"s":""}`;
   el.innerHTML=list.length?list.map(card).join(""):`<div class="empty"><h3>No cars found</h3><p>Try changing your filters.</p></div>`;
   bindFavorites();
 };
 [searchEl,makeEl,bodyEl,priceEl,yearEl,sortEl].forEach(x=>x.addEventListener("input",draw));
 document.querySelector("[data-clear-filters]")?.addEventListener("click",()=>{searchEl.value=makeEl.value=bodyEl.value=priceEl.value=yearEl.value="";draw()});
 draw();
}
function renderDetails(){
 const el=document.querySelector("#carDetails"); if(!el)return;
 const id=Number(new URLSearchParams(location.search).get("id"))||1;
 const c=cars.find(x=>x.id===id)||cars[0];
 document.title=`${c.make} ${c.model} — AutoVista`;
 el.innerHTML=`<section class="details"><div class="detail-top"><div class="gallery-main"><img src="${c.image}" alt="${c.make} ${c.model}"></div><div class="detail-card"><span class="eyebrow">VERIFIED LISTING</span><h1>${c.make} ${c.model}</h1><div class="car-meta">${c.year} · ${c.mileage.toLocaleString()} miles · ${c.location}</div><div class="detail-price">${money(c.price)}</div><div class="specs"><div><span>Body</span>${c.body}</div><div><span>Fuel</span>${c.fuel}</div><div><span>Transmission</span>${c.transmission}</div><div><span>Year</span>${c.year}</div></div><div class="detail-actions"><button class="btn btn-primary" id="inquire">Contact seller</button><button class="btn btn-dark" data-fav="${c.id}">${favorites.includes(c.id)?"♥":"♡"} Save</button></div></div></div><div style="max-width:850px;margin:55px 0"><span class="eyebrow">VEHICLE OVERVIEW</span><h2>Clean, verified and ready to drive.</h2><p class="car-meta" style="line-height:1.8">This listing includes vehicle information supplied by the seller and reviewed by AutoVista. Contact the seller to arrange a viewing, test drive and final transaction.</p></div></section>`;
 bindFavorites();
 document.querySelector("#inquire").addEventListener("click",()=>alert("Seller inquiry started. In a production app this would open a secure messaging system."));
}
function setupForms(){
 document.querySelector("#sellForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Thanks! Your car has been submitted for review.");e.target.reset()});
 document.querySelector("#contactForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Message sent successfully.");e.target.reset()});
 document.querySelector("[data-newsletter]")?.addEventListener("submit",e=>{e.preventDefault();alert("You're subscribed!");e.target.reset()});
 document.querySelector("#loginForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Demo sign-in successful.")});
 document.querySelector("#registerForm")?.addEventListener("submit",e=>{e.preventDefault();alert("Demo account created.")});
 document.querySelectorAll("[data-auth-tab]").forEach(tab=>tab.addEventListener("click",()=>{
   document.querySelectorAll("[data-auth-tab]").forEach(x=>x.classList.remove("active"));tab.classList.add("active");
   document.querySelectorAll("[data-auth-form]").forEach(f=>f.hidden=f.dataset.authForm!==tab.dataset.authTab);
 }));
}
function setupCalculator(){
 const calc=()=>{
  const p=Math.max(0,Number(document.querySelector("#loanPrice").value)||0);
  const d=Math.max(0,Number(document.querySelector("#downPayment").value)||0);
  const rate=(Number(document.querySelector("#interestRate").value)||0)/100/12;
  const n=Number(document.querySelector("#loanTerm").value)||60;
  const principal=Math.max(0,p-d);
  const payment=rate===0?principal/n:principal*(rate*Math.pow(1+rate,n))/(Math.pow(1+rate,n)-1);
  document.querySelector("#monthlyPayment").textContent=money(Math.round(payment));
 };
 document.querySelector("#calculateLoan")?.addEventListener("click",calc);calc();
}
document.querySelector("[data-menu]")?.addEventListener("click",()=>document.querySelector(".nav").classList.toggle("open"));
renderFeatured();renderInventory();renderDetails();setupForms();setupCalculator();updateFavoriteCount();

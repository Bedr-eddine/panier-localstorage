

//recuperer les données du fichier json
let result = new XMLHttpRequest();
result.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200){
        let data = JSON.parse(this.response).telephones;
        
        //afficher les articles dans la page html
        for(let i=0; i<data.length;i++){
            //div contenant chaque article
            let myDiv =  document.createElement('div');
            myDiv.classList.add("productContainer");
            //creer le nom du produit
            let myTitle = document.createElement('h2');
            myTitle.classList.add('centre');
            myTitle.innerText = data[i].modele;
            //ajouter le div contenant chaque produit comme enfant du main
            document.querySelector(".monFlex").appendChild(myDiv);
            //ajouter le titre comme enfant du div contenant chaque article
            myDiv.appendChild(myTitle);
            //creer l'image du produit
            let myImg = document.createElement('img');
            myImg.setAttribute("src", "img/"+data[i].img);
            //creer une div pour contenir l'image
            let myImgDiv = document.createElement('div');
            myImgDiv.classList.add('imgContainer');
            //mettre l'image dans sa div
            myImgDiv.appendChild(myImg);
            //mettre la div de l'image dans la div de l'article
            myDiv.appendChild(myImgDiv);
            //Creer le prix
            let myPrix = document.createElement('h3');
            myPrix.innerText = data[i].prix+" €";
            myPrix.classList.add('centre');
            //attacher le prix a la div de l'article
            myDiv.appendChild(myPrix);
            //creer le boutton ajouter au panier
            let bouton = document.createElement('button');
            bouton.innerText = "Ajouter au panier";
            bouton.classList.add('myButton');
            //ajouter le bouton a la div de l'article
            myDiv.appendChild(bouton);
            
            //Ajout des articles au panier
            document.querySelectorAll('.myButton')[i].addEventListener("click", ()=>{
                ajout(data[i]);
               
            })
         }   
        
        };
       
        //fonction pour ajouter les produits  au localstorage
        let ajout = (produit)=>{
            let produitAjoute = localStorage.getItem('produitAjoute');
            produitAjoute = JSON.parse(produitAjoute);
            //on verifie s'il y a deja des données dans localstorage
            if (produitAjoute != null){
                //si le produit n'a pas encore été ajouté on l'ajoute au localstorage
                if (produitAjoute[produit.id] == undefined){
                    produitAjoute = {
                        ...produitAjoute,
                        [produit.id]: produit
                    }
                    produitAjoute[produit.id].qte += 1;
                } else{
                    //si le produit existe deja on incremente seulement sa quantiité
                    produitAjoute[produit.id].qte += 1;
                }
                
            } else{
                //Si aucun produit n'a encore été ajouté au local storage on initialise l'objet qui contiendra tous les produits ajoutés
                produit.qte = 1;
                 produitAjoute = {
                     [produit.id]: produit
                 }
                 
                 
            }
            //On clacule le prix total pour chaque produit selon la quantité
            produitAjoute[produit.id].prixTotal = (Number(produitAjoute[produit.id].prix)*Number(produitAjoute[produit.id].qte).toFixed(2)); 
            //On ajoute l'objet des produits ajoutés au localstorage
            localStorage.setItem('produitAjoute', JSON.stringify(produitAjoute));
            
        }

        //creation du panier et de ses differentes donnees
        let mobiles = JSON.parse(localStorage.getItem('produitAjoute'));
        let myPanier = document.querySelector('.panier');
        let prixGlobal = 0;
        
        myPanier.innerHTML='<h1>Mon panier</h1>';
        if (mobiles && myPanier){
            Object.values(mobiles).map((mobile)=>{
                if(mobile.qte != 0){
                //total de tous les achats 
                prixGlobal += Number(mobile.prixTotal);
                
                //creation du panier
                
                myPanier.innerHTML += `
                <div class="ligne" id="${mobile.id}">
                    <img src="./img/${mobile.img}">
                    <div class="nomProduit">${mobile.modele}</div>
                    <div class="minus" id="minus${mobile.id}">
                        <button class="min">-</button>
                    </div>
                    <p class="qte" id="count${mobile.id}">${mobile.qte}</p>
                    <div class="plus" id="plus${mobile.id}">
                        <button class="plu">+</button>
                    </div>
                    <div class="prixProduit">
                        <p> Prix: <span class='prix' id='prix${mobile.id}'> ${mobile.prixTotal}</span> €
                        </p>
                    </div>
                    <button class="supButton" id='sup${mobile.id}'>X</button>
                </div>

                `}
               
            })  
            //creation du total des achats et application de la réduction le cas échéant
            if(prixGlobal >= 600){
                prixGlobal = prixGlobal - (prixGlobal/20);
                myPanier.innerHTML += "<p id='promo'>Vous avez bénificié de 5% de réduction</p>";
            } else{
                myPanier.innerHTML += `<p id='promo'>Plus que ${(600-prixGlobal).toFixed(2)} € pour bénificier de 5% de réduction</p>`;
            }
            myPanier.innerHTML += `
            <div class="total">
                <p class="prixglobal">
                    Total des achats: <span id='prixGlobal'>${prixGlobal.toFixed(2)} </span> €
                </p>
            </div>
            `
            
            
            //fonction pour incrementer le nombre d'articles
            let incremente = (myId)=>{
                //on incremente la quantité
                mobiles[myId].qte  += 1;
                //on modifie le prix total selon la quantité
                mobiles[myId].prixTotal = mobiles[myId].prix * mobiles[myId].qte;
                //on met à jour le localstorage
                localStorage.setItem('produitAjoute', JSON.stringify(mobiles));
                //on met à jour l'affichage de la quantite du prix total par ligne et le total des achats
                document.getElementById(`count${myId}`).innerText = mobiles[myId].qte;
                document.getElementById(`prix${myId}`).innerText = mobiles[myId].prixTotal;
                prixGlobal = 0;
                Object.values(mobiles).map((mobile)=>{
                    prixGlobal += mobile.prixTotal;
                })
                if(prixGlobal>=600){
                    prixGlobal = prixGlobal - (prixGlobal/20);
                    document.getElementById('promo').innerText = "Vous avez bénificié de 5% de réduction";
                } else{
                    document.getElementById('promo').innerText = `Plus que ${(600-prixGlobal).toFixed(2)} € pour économiser 5%`;
                }
                document.getElementById('prixGlobal').innerText = prixGlobal.toFixed(2);
            }
            //fonction pour décrémenter la quantité
            let decremente = (myId)=>{
                if(Number(mobiles[myId].qte)>1){
                    //on decremente la quantite
                mobiles[myId].qte  -= 1;
                //on met a jours le prix total
                mobiles[myId].prixTotal = mobiles[myId].prix * mobiles[myId].qte;
                //on met à jour le local storage
                localStorage.setItem('produitAjoute', JSON.stringify(mobiles));
                //on met à jours l'affichage de la qantité des prix et du total des achats
                document.getElementById(`count${myId}`).innerText = mobiles[myId].qte;
                document.getElementById(`prix${myId}`).innerText = mobiles[myId].prixTotal;
                prixGlobal = 0;
                Object.values(mobiles).map((mobile)=>{
                    prixGlobal += mobile.prixTotal;
                })
                if(prixGlobal>=600){
                    prixGlobal = prixGlobal - (prixGlobal/20);
                    document.getElementById('promo').innerText = "Vous avez bénificié de 5% de réduction";
                } else{
                    document.getElementById('promo').innerText = `Plus que ${(600-prixGlobal).toFixed(2)} € pour économiser 5%`;
                }
                document.getElementById('prixGlobal').innerText = prixGlobal.toFixed(2);
            
                }
                
                }

                //fonction pour supprimer une ligne d'un produit
            let supprime = (myId)=>{
                let conf = confirm('Etes-vous sûr de vouloir supprimer?');
                if(conf){
                    //on met la quantité du produit à 0
                mobiles[myId].qte = 0;
                //on met a jours le prix total
                mobiles[myId].prixTotal = mobiles[myId].prix * mobiles[myId].qte;
                //on met à jour le local storage
                localStorage.setItem('produitAjoute', JSON.stringify(mobiles));
                //on supprime la ligne du produit du panier
                myPanier.removeChild(document.getElementById(myId));
                //on remet à jour l'affichage du panier (prix total des achats...)
                prixGlobal = 0;
                Object.values(mobiles).map((mobile)=>{
                    prixGlobal += mobile.prixTotal;
                })
                if(prixGlobal>=600){
                    prixGlobal = prixGlobal - (prixGlobal/20);
                    document.getElementById('promo').innerText = "Vous avez bénificié de 5% de réduction";
                } else{
                    document.getElementById('promo').innerText = `Plus que ${(600-prixGlobal).toFixed(2)} € pour économiser 5%`;
                }
                document.getElementById('prixGlobal').innerText = prixGlobal.toFixed(2);
                }
                
            
            }    
            //recupérer les clefs des objets en localstorage pour ajouter les
            //fonction incremente et decremente aux bouttons + et -
            let keys = Object.keys(mobiles);
            for (let n=0; n<keys.length; n++ ){
                let myId = keys[n];
                document.getElementById(`plus${myId}`).addEventListener('click', (e)=>{
                    e.preventDefault();
                    incremente(myId);
                });

                document.getElementById(`minus${myId}`).addEventListener('click', (e)=>{
                    e.preventDefault();
                    decremente(myId);
                });
                document.getElementById(`sup${myId}`).addEventListener('click', (e)=>{
                    e.preventDefault();
                    supprime(myId);
                });
            }
            
            
            
        }
        
        
       
    }

result.open('POST', 'donnees.json', true);
result.send();


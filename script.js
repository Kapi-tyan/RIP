const wrapper = document.querySelector('.wrapper');
const form = document.querySelector('.form__input');
const repo = document.querySelector('.repo');
const repoSearch = document.querySelector('.repo-search');
const repoError = document.querySelector('.repo__err');

function createItemRepo(name, owner, stars) {
    const itemRepo = document.createElement('li');
    itemRepo.classList.add('repo__item--active');   
    const itemInnerText = 
            `<div class="repo__item__content">
            <span class="repo__item__text">Name: ${name}</span>
            <span class="repo__item__text">Owner: ${owner}</span>
            <span class="repo__item__text">Stars: ${stars}</span>
            </div>
            <div class="repo__item__button--delete"></div>`;
    itemRepo.insertAdjacentHTML('beforeend', itemInnerText);                
    repo.append(itemRepo);
};

async function getRepo(repoName){  
   repoError.textContent = ''
   if (repoName.trim() === '') 
      return;
    try {       
        const reply = await fetch(`https://api.github.com/search/repositories?q=${repoName}&per_page=5`);
        const data = await reply.json();
        const total = await data.total_count        
        if (total == 0){      
            const errInnerText = 
                    `<span class="repo--null">Репозиторий не найден</span>`;
                    repoError.insertAdjacentHTML('beforeend', errInnerText);         
        }    
        return data.items;
    } catch (e) {
      console.error(e);     
    }
};

async function addRepo(event){
    
    repoSearch.textContent ='';
    try {
       
        const data = await getRepo(event.target.value);
        const fragment = document.createDocumentFragment();
        
        data.forEach((repo) => {
            const repoSearchItem = document.createElement('li');
            repoSearchItem.classList.add('repo-search__item');
            repoSearchItem.classList.add('repo-list');
            repoSearchItem.textContent = `${repo.name}`;
            fragment.append(repoSearchItem);

            repoSearchItem.addEventListener('click', () => {
                createItemRepo(repo.name, repo.owner.login, repo.forks_count);
                repoSearch.textContent = '';
                form.value = '';
                
            });
        });
        repoSearch.append(fragment);
    } catch (e) {
      console.error(e);
    }
};

function clickWrapper(x){
    let target = x.target;
    if (target.classList.contains('repo__item__button--delete')) {
        const reposi = target.closest('.repo__item--active');
        if (reposi) {
            reposi.remove();
        }
    }
};

const debounce = (fn, debounceTime) => {
    let timeOut;
    return function(...args){
        clearTimeout(timeOut);
        timeOut = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    };
};

wrapper.addEventListener('click', clickWrapper );
wrapper.addEventListener('input', debounce(addRepo, 400)); 

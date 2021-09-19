const elements = {

    pagebar:document.getElementById('page-bar'),
    shownum:document.getElementById('show-pagenum'),
    shownum_wrapper:document.getElementById('bar-mid'),

    showlist: document.getElementById('show-list'),

    tologin : document.getElementById('tologin'),
    tomypage : document.getElementById('tomypage'),
    mypagetext : document.getElementById('mypost'),

    passshow: document.getElementById('passshow'),
    passhide : document.getElementById('passhide'),

    input_password : document.getElementById('input-password'),
    input_id: document.getElementById('input-id'),
    login_modal : document.getElementById('login-background'),

    input_reg_password : document.getElementById('reg-input-password'),
    input_reg_id : document.getElementById('reg-input-id'),
    reg_modal : document.getElementById('reg-background'),

    postpage : document.getElementById('post-wrapper-wrapper'),
    input_post_title :document.getElementById('post-title-input'),
    input_post_content : document.getElementById('post-content-input'),
    post_button : document.getElementById('post-button'),


    detailpage : document.getElementById('detail-wrapper-wrapper'),
    detail_title : document.getElementById('detail-title'),
    detail_writer : document.getElementById('detail-writer'),
    detail_content : document.getElementById('detail-content'),
    edit_button : document.getElementById('edit-button'),

    editpage : document.getElementById('edit-wrapper-wrapper'),
    input_edit_title : document.getElementById('edit-title-input'),
    input_edit_content : document.getElementById('edit-content-input'),
    config_edit_button : document.getElementById('config-edit-button')
}

//

var api_len;
var api_info;
var api_detail;
var totalpage;
var currentpage = 1;
var pagelen;
var accesscode;
var userid;
var onmypage=0;

//-------------------리스트 렌더링 외 자잘한 렌더링 구역 --------------------

fetch('http://3.36.82.24:8080/post') // 이건 맨 처음 변수저장용 api 호출
.then(res=>res.json())
.then(data=> {
    console.log(data)
    const len = data.posts.length;
    console.log(len)
    api_len = data.posts.length;
    api_info = data.posts;
    totalpage = (api_len%10)>0 ? parseInt(api_len/10)+1 : parseInt(api_len/10);
    console.log('totalpage:'+totalpage)
    pagelen= totalpage
    renderNumbar(currentpage);
    console.log(api_info);
    
    
})

const Render = (mydata) => {
    console.log('mydata : ',mydata);
    fetch('http://3.36.82.24:8080/post')
    .then(res=> res.json())
    .then(data => {
        if(mydata===undefined){ //mydata가 넘어오지 않은 경우
            console.log(data) // api 불러오기 테스트

            const len = data.posts.length; //posts 갯수
            console.log(len)

            api_len = data.posts.length; //posts 갯수 2
            api_info = data.posts; //각 posts 데이터
            console.log(api_info);

            totalpage = (api_len%10)>0 ? parseInt(api_len/10)+1 : parseInt(api_len/10); //post 갯수를 이용한 페이지 분할 계산
            console.log('totalpage:'+totalpage)

            pagelen= totalpage // 페이지 길이(==totalpage, 근데 이거 왜 똑같은걸 하나 더 만들어놨지?)
        }
        else{ // mydata가 넘어온 경우
            console.log(mydata) // api 불러오기 테스트

            const len = mydata.posts.length; //posts 갯수
            console.log(len)

            api_len = mydata.posts.length; //posts 갯수 2
            api_info = mydata.posts; //각 posts 데이터
            console.log(api_info);

            totalpage = (api_len%10)>0 ? parseInt(api_len/10)+1 : parseInt(api_len/10); //post 갯수를 이용한 페이지 분할 계산
            console.log('totalpage:'+totalpage)

            pagelen= totalpage // 페이지 길이(==totalpage, 근데 이거 왜 똑같은걸 하나 더 만들어놨지?)
            currentpage=1;
            elements.mypagetext.style.display = 'block';
        }

        renderNumbar(currentpage); //넘버바 렌더링
        let num=1;
        for(let i=(currentpage-1)*10;i<(currentpage*10);i++){
            console.log('한번 돌음')
            if(i<api_len){
                elements.showlist.insertAdjacentHTML('beforeend',`
                <div class="lists">
                    <div class="list-left-side">
                        <span>${num++}</span>
                    </div>
                    <li onClick="showDetail(${api_info[i].id})">${api_info[i].title}</li>
                </div>
                
                
                
                
                `)
            }
            else{
                elements.showlist.insertAdjacentHTML('beforeend',`
                <div class="lists">
                    <div class="list-left-side">
                        
                    </div>
                    <li></li>
                </div>
                `)
            }
        }
    })
}
Render();

const deleteList = () => { //목록 삭제
    const target = document.getElementsByClassName('lists')
    console.log(target.length)
    const targetlen = target.length;
    for(let i=0;i<targetlen;i++){
        target[0].remove();        
    }
    console.log('succesfully removed(lists)')
}


var detaildata;
var detailid;
const showDetail = (id) => { //세부보기
    toMain();
    detailid = id
    fetch(`http://3.36.82.24:8080/post/${id}`)
    .then(res => res.json())
    .then(data => {
        detaildata = data;
        console.log('data',data);
        elements.detail_title.innerText = data.title;
        elements.detail_content.innerText = data.content;
        elements.detail_writer.innerText = data.userId;
        if(data.userId === userid){
            //수정 활성화
            elements.edit_button.style.display = 'block';
        }
        else{
            elements.edit_button.style.display = 'none';
        }
        elements.detailpage.style.display = 'flex';
    })
}


//---------------------------로그인 구역----------------------------

const showReg = () => {
    elements.input_reg_id.value = null;
    elements.input_reg_password.value = null;
    elements.reg_modal.style.display= 'flex';
}

const closeReg = () => {
    elements.reg_modal.style.display= 'none';

}

const onReg = () => {
    signUp(elements.input_reg_id.value,elements.input_reg_password.value);
}




const signUp = (id,password) => { //회원가입
    fetch('http://3.36.82.24:8080/account',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                id: id,
                password: password
            }
        ),
    })
    .then(res => {
        console.log(res)
        console.log(res.status)
        if(res.status === 409){
            alert('이미 존재하는 ID입니다. 다른 ID로 시도해주세요.')
        }
        if(res.status === 201){
            alert('성공적으로 가입되었습니다!');
            closeReg();
        } 
    })
   
}



const logIn = (id,password) => { //로그인
    fetch('http://3.36.82.24:8080/auth',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
            {
                password: password,
                userId: id
            }
        ),
    })  
    .then(res =>{
        if(res.ok){
            alert('성공적으로 로그인되었습니다!');
            elements.tologin.style.display= 'none';
            elements.tomypage.style.display='block'
            userid = id; //로그인에 성공했다면 입력한 아이디 저장(자기가 쓴 글 판별용)
            closeModal();
            return res.json();
        }
        else{
            alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
        }
    })
    .then(data=>{
        console.log(data);
        accesscode = 'Bearer '+data.accessToken;
        console.log(accesscode);
    })
    
    
}

const showModal = () => { //로그인창 띄우기
    elements.login_modal.style.display='flex'
    elements.input_id.focus();
}

const closeModal = () => { // 로그인창 닫기
    elements.passshow.style.display='none';
    elements.passhide.style.display='block';
    elements.input_password.type='password';
    elements.input_id.value = null;
    elements.input_password.value = null;
    elements.login_modal.style.display='none'

}

const toggleShow = (value) => { // 비밀번호 보이는거 전환
    if(value){
        elements.passshow.style.display='block';
        elements.passhide.style.display='none';
        elements.input_password.type='text';
    }
    else{
        elements.passshow.style.display='none';
        elements.passhide.style.display='block';
        elements.input_password.type='password';

    }
}

function onLogin() // 엔터키 감지해서 로그인
{
     if(event.keyCode == 13)
     {
        logIn(elements.input_id.value,elements.input_password.value);
     }
}


//-------------------------------마이페이지 구역------------------------------

var mydata;
const myPage = () => { //마이페이지
    toMain();
    fetch('http://3.36.82.24:8080/mypage',{
        method: 'GET',
        headers: { 
            Authorization : accesscode,
            'Content-Type': 'application/json' 
        }
    })
    .then(res => {
        if(res.ok){
            console.log(res);
            return res.json();
        }
        else{
            alert('실패')
        }
    })
    .then(data=>{
        console.log(data);
        deleteList();
        onmypage=1;
        mydata = data;
        Render(data)

    })
}








//------------------------------------글 작성 구역-----------------------------------

const Post = (access,title,content) => { //게시
    fetch('http://3.36.82.24:8080/post',{
        method: 'POST',
        headers: { 
            Authorization : access,
            'Content-Type': 'application/json' 
        },
        body : JSON.stringify(
            {
                content:content,
                title:title
            }
        )}
    )
    .then(res => {
        if(res.ok){
            console.log(res);
            alert('게시글이 성공적으로 업로드되었습니다.')
            elements.postpage.style.display='none';
            currentpage=totalpage;
            deleteList();
            Render();
        }
        else{
            alert('글 작성에 실패했습니다.')
        }
    })
}

const writePost = () => { // 작성 글자 클릭시
    if(userid===undefined){
        alert('로그인이 필요합니다!');
        showModal();
    }
    else{
        toMain();
        elements.postpage.style.display='flex';
    }
}



var canpost=0;
elements.input_post_title.oninput = () => { // 게시글 input 값 실시간 감지
    if(elements.input_post_title.value == "" || elements.input_post_title.value == null || elements.input_post_content.value == "" || elements.input_post_content.value == null){
        elements.post_button.style.backgroundColor = '#EDEDED';
        elements.post_button.style.color = '#5F5F5F';
        canpost=0;
    }
    else{
        elements.post_button.style.backgroundColor = '#386BEE';
        elements.post_button.style.color = 'white';
        canpost=1;
    }    
}

elements.input_post_content.oninput = () => {
    if(elements.input_post_title.value == "" || elements.input_post_title.value == null || elements.input_post_content.value == "" || elements.input_post_content.value == null){
        elements.post_button.style.backgroundColor = '#EDEDED';
        elements.post_button.style.color = '#5F5F5F';
        canpost=0;
    }
    else{
        elements.post_button.style.backgroundColor = '#386BEE';
        elements.post_button.style.color = 'white';
        canpost=1;
    }    
}


const configPost = () => { // 최종 post
    console.log(canpost)
    if(canpost)
        Post(accesscode,elements.input_post_title.value,elements.input_post_content.value)
        elements.input_post_title.value = null;
        elements.input_post_content.value = null;
}

//------------------------------글 수정 구역--------------------------------


const showEdit = () => {
    elements.input_edit_title.value = detaildata.title;
    elements.input_edit_content.value = detaildata.content;
    elements.editpage.style.display = 'flex';
}

const configEdit = () => {
    if(elements.input_edit_content.value !== "" && elements.input_edit_content.value !== null &&  elements.input_edit_title.value !== "" && elements.input_edit_title.value !== null){
        fetch(`http://3.36.82.24:8080/post/${detailid}`,{
            method: 'PATCH',
            headers: { 
                Authorization : accesscode,
                'Content-Type': 'application/json' 
            },
            body : JSON.stringify(
                {
                    content:elements.input_edit_content.value ,
                    title: elements.input_edit_title.value
                }
            )}
        )
        .then(res => {
            if(res.ok){
                alert('성공적으로 수정되었습니다.');
                elements.input_edit_title.value = null;
                elements.input_edit_content.value = null;
                elements.editpage.style.display = 'none';
                elements.detailpage.style.display = 'none';
                currentpage= parseInt(detailid/10)+1;
                deleteList();
                Render();
            }
            else{
                alert('수정에 실패했습니다.');
                console.log(res)
                console.log(detailid)
            }
        })
    }
    else{
        alert('내용을 입력해주세요.')
    }

}


//------------------------------모든 창 끄기 구역 --------------------------------

const toMain = () => {
    closeModal(); //로그인 닫기
 
    //작성창 닫기
    elements.postpage.style.display = 'none';
    elements.input_post_title.value = null;
    elements.input_post_content.value = null;



    //수정창 닫기
    elements.input_edit_title.value = null;
    elements.input_edit_content.value = null;
    elements.editpage.style.display = 'none';


    //마이페이지 닫기
    elements.mypagetext.style.display = 'none';
    deleteList();
    onmypage=0;
    Render()


    //상세보기 닫기
    elements.detailpage.style.display = 'none';

}














//----------------- 넘버바 구역 -----------------

const deleteNum = () => { //숫자들 삭제
    const target = document.getElementsByClassName('pagenum')
    console.log(target.length)
    const targetlen = target.length;
    for(let i=0;i<targetlen;i++){
        target[0].remove();        
    }
    console.log('succesfully removed(numbar)')
}


const renderNumbar = (current) => { //숫자들 생성
    console.log('렌더링 중...')
    deleteNum();
    const len = (parseInt((current-1)/10)+1)*10;
    console.log('이건 무슨 len?',len)
    for (let i=len-9;i<=(len>pagelen ? pagelen : len);i++){
        elements.shownum.insertAdjacentHTML('beforebegin',`
        <div class='pagenum' onClick="movePage(${i})" id=${'page'+i} style=${i === currentpage ? 'font-weight:bold;' : 'font-weight:unset'}>${i}</div>
        `)
    }
}



const currentpart = currentpage
const movePage = (pos) => { //숫자 페이지 이동
    console.log('이동 호출됨')
    if (pos == 'prev'){
        if(currentpage-10 <1){
            alert('첫 페이지입니다.');
            return;
        }
        else{
            
            currentpage -= ((currentpage%10 ? currentpage%10 : 10)+9);
            currentpage+=9;
            console.log('moved to prev')
        }
    }
    else if (pos == 'next'){
        if(currentpage+10>pagelen){
            alert('마지막 페이지입니다.');
            return;
        }
        else{
            currentpage+=10 - ((currentpage%10 ? currentpage%10 : 10)-1);
            console.log('moved to next')
        }
    }
    else if (pos == 'last'){
        currentpage = pagelen;
        console.log('moved to last');
    }
    else{
        if (pos<1){
            alert('0 이하의 페이지는 존재하지 않습니다.')
            return;
        }
        else if (pos>pagelen){
            alert(pagelen+1+' 이상의 페이지는 존재하지 않습니다.')
            return;
        }
        else{
            currentpage = pos;
        }
    }
    console.log('currentpage:',currentpage)
    renderNumbar(currentpage)
    deleteList();
    if(onmypage){
        Render(mydata);
    }
    else{
        Render();
    }
}



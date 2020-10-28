//login check
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');

const loginCheck = user => {
    if(user){
        loggedInLinks.forEach(link => link.style.display = 'block');
        loggedOutLinks.forEach(link => link.style.display = 'none');
    }else{
        loggedInLinks.forEach(link => link.style.display = 'none');
        loggedOutLinks.forEach(link => link.style.display = 'block')
    }
}

const signUpForm = document.querySelector('#signup-form');

//SingUp
signUpForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const email = document.querySelector('#signup-email').value;
    const password = document.querySelector('#signup-password').value;

    auth
        .createUserWithEmailAndPassword(email,password)
        .then(userCredential => {

            //clear the form
            signUpForm.reset();

            //close the modal
            $('#signupModal').modal('hide')


            console.log('singUp');
        })

});

//SingIn
const signInForm = document.querySelector('#login-form');

signInForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;
    

    auth
    .signInWithEmailAndPassword(email,password)
    .then(userCredential => {

        //clear the form
        signInForm.reset();

        //close the modal
        $('#signInModal').modal('hide');


        console.log('sing in');
    })
});

const logout = document.querySelector('#logout');

logout.addEventListener('click', (e) => {
    e.preventDefault();

    auth.signOut().then(() => {
        console.log('signout')
    }) 
});

// Login with Google
const googleButton = document.querySelector("#googleLogin");

googleButton.addEventListener("click", (e) => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log("google sign in");
    //clear the form
    signInForm.reset();

    //close the modal
    $('#signInModal').modal('hide')
    

  })
  .catch(err => {
    console.log(err);
  })
});

// Login with Facebook
const facebookButton = document.querySelector('#facebookLogin');

facebookButton.addEventListener('click', e => {
  const provider = new firebase.auth.FacebookAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    console.log("facebook sign in");

    //clear the form
    signInForm.reset();

    //close the modal
    $('#signInModal').modal('hide')
  })
  .catch(err => {
    console.log(err);
  })

})

//Posts

const postList = document.querySelector('.posts');
const setupPosts = data => {
    if(data.length){
        
        let html = '';
        data.forEach(doc => {
            const post = doc.data();
            console.log(post);

            const li = `
            <li class="list-group-item list-group-item-action">
                <h5>${post.title}</h5>
                <p>${post.description}</p>
            </li>
            `;
            html += li;
        });
        postList.innerHTML = html;
    }else{
        postList.innerHTML = '<p class="text-center">Login to see Posts</p>'
    }
}



// Events
//listar datos para los usuarios autenticados
auth.onAuthStateChanged(user => {
    if(user){
        fs.collection('posts')
            .get()
            .then((snapshot) => {
                setupPosts(snapshot.docs);
                loginCheck(user);
            })
    }else{
        setupPosts([])
        loginCheck(user);
    }
})
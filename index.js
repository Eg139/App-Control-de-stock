const db = firebase.firestore();

const taskform = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");

const saveTask = (title,sexo,prendas,talle_s,talle_m,talle_l,talle_xl,description) =>
db.collection("Productos").doc().set({
        title,
        sexo,
        prendas,
        talle_s: parseInt(talle_s,10),
        talle_m:  parseInt(talle_m,10),
        talle_l:  parseInt(talle_l,10),
        talle_xl:  parseInt(talle_xl,10),
        description
    });
const getTask = () => db.collection('Productos').get();
const onGetTasks = (callback) => db.collection('Productos').onSnapshot(callback);

const deleteTask = id => db.collection('Productos').doc(id).delete();

window.addEventListener('DOMContentLoaded', async (e) =>{
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {

        const producto = doc.data();
        producto.id = doc.id;

        taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
            <h3 class="h5">${producto.title}</h3>
            <p>${producto.prendas} ${producto.sexo} ${producto.talle_s} ${producto.talle_m} ${producto.talle_l} ${producto.talle_xl} ${producto.description}</p>
            <div>
                <button class="btn btn-primary btn-borrar" data-id="${producto.id}">Borrar</button>
                <button class="btn btn-danger btn-borrar">Editar</button>
            </div>
            </div>`

            const btns_borrar = document.querySelectorAll('.btn-borrar');
            btns_borrar.forEach(btn => {
                btn.addEventListener('click', async (e) =>{
                    await deleteTask(e.target.dataset.id);
                });
            });
        });
    });
});

taskform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = taskform["task-title"];
    const prendas = taskform["prendas"];
    const sexo = taskform["sexo"];
    const talle_s = taskform["talleS"];
    const talle_m = taskform["talleM"];
    const talle_l = taskform["talleL"];
    const talle_xl = taskform["talleXl"];
    const description = taskform["description"];

    await saveTask(title.value,sexo.value,prendas.value,talle_s.value,talle_m.value,talle_l.value,talle_xl.value,description.value);


    taskform.reset();
    title.focus();
});
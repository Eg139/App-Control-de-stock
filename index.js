const db = firebase.firestore();

const taskform = document.getElementById("task-form");
const taskContainer = document.getElementById("task-container");

let editStatus = false;
let id = '';

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
const getTask = () => 
    db.collection('Productos').get();

const getProducto = (id) => 
    db.collection('Productos').doc(id).get();

const onGetTasks = (callback) => 
    db.collection('Productos').onSnapshot(callback);

const deleteTask = id => 
    db.collection('Productos').doc(id).delete();

const updateTask = (id, updateTask) =>
    db.collection('Productos').doc(id).update(updateTask);


window.addEventListener('DOMContentLoaded', async (e) =>{
    onGetTasks((querySnapshot) => {
        taskContainer.innerHTML = '';
        querySnapshot.forEach((doc) => {

        const producto = doc.data();
        producto.id = doc.id;

        taskContainer.innerHTML += `<div class="card card-body mt-2 border-primary">
            <h3 class="h5">${producto.title}</h3>
            <p>${producto.prendas}  -  ${producto.sexo}</p>
            <ul>
                <li>
                    <div class="row stock">
                        <div class="col-md-6">
                            Talle s
                        </div>
                        <div class="col-md-6">
                            ${producto.talle_s}
                        </div>
                    </div>
                </li>
                <li>
                <div class="row stock">
                    <div class="col-md-6">
                        Talle m
                    </div>
                    <div class="col-md-6">
                        ${producto.talle_m}
                    </div>
                    </div>
                </li>
                <li>
                <div class="row stock">
                <div class="col-md-6">
                    Talle l
                    </div>
                        <div class="col-md-6">
                            ${producto.talle_l}
                        </div>
                    </div>
                </li>
                <li>
                <div class="row stock">
                <div class="col-md-6">
                    Talle Xl
                    </div>
                        <div class="col-md-6">
                            ${producto.talle_xl}
                        </div>
                    </div>
                </li>
            </ul>
            <p>${producto.description}</p>
            <div>
                <button class="btn btn-primary btn-borrar" data-id="${producto.id}">Borrar</button>
                <button class="btn btn-danger btn-editar" data-id="${producto.id}">Editar</button>
            </div>
            </div>`

            const btns_borrar = document.querySelectorAll('.btn-borrar');
            btns_borrar.forEach(btn => {
                btn.addEventListener('click', async (e) =>{
                    await deleteTask(e.target.dataset.id);
                    
                });
            });

            const btnEditar = document.querySelectorAll('.btn-editar');
            btnEditar.forEach(btn => {
                btn.addEventListener('click', async (e) =>{
                    const doc = await getProducto(e.target.dataset.id);
                    const task = doc.data();

                    editStatus = true;
                    id = doc.id;

                    taskform['task-title'].value = task.title;
                    taskform['prendas'].value = task.prendas;
                    taskform['sexo'].value = task.sexo;
                    taskform['talleS'].value = task.talle_s;
                    taskform['talleM'].value = task.talle_m;
                    taskform['talleL'].value = task.talle_l;
                    taskform['talleXl'].value = task.talle_xl;
                    taskform['description'].value = task.description;

                    taskform['btn-task-form'].innerHTML= 'Update';
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

    if(!editStatus)
    {
         await saveTask(title.value,sexo.value,prendas.value,talle_s.value,talle_m.value,talle_l.value,talle_xl.value,description.value);
    }else{
        await updateTask(id, {
            title:title.value,
            prendas:prendas.value,
            talle_s: talle_s.value,
            talle_m: talle_m.value,
            talle_l: talle_l.value,
            talle_xl: talle_xl.value,
            description: description.value

        });

        editStatus = false;
        id = ''; 
        taskform['btn-task-form'].innerText = 'Save';
    }


    taskform.reset();
    title.focus();
});
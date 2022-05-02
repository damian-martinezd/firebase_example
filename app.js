firebase.initializeApp(config);
// Firebase Database Reference and the child
const dbRef = firebase.database().ref();
const usersRef = dbRef.child('users');


class FireBaseCrude {
    constructor() {
        this.addEvents();
        this.readUserData();
    }
    addEvents() {
        const addUserBtnUI = document.getElementById("add-user-btn");
        addUserBtnUI.addEventListener("click", this.addUserBtnClicked)
        const saveBtn = document.querySelector("#edit-user-btn");
        saveBtn.addEventListener("click", this.saveUserBtnClicked)
    }
    userClicked(e) {
        var userID = e.target.getAttribute("user-key");
        const userRef = dbRef.child('users/' + userID);
        const userDetailUI = document.getElementById("user-detail");
        userRef.on("value", snap => {
            userDetailUI.innerHTML = ""
            snap.forEach(childSnap => {
                var $p = document.createElement("p");
                $p.innerHTML = childSnap.key + " - " + childSnap.val();
                userDetailUI.append($p);
            })
        });
    }

    // --------------------------
    // READ
    // --------------------------
    readUserData() {
            const userListUI = document.getElementById("user-list");
            usersRef.on("value", snap => {
                userListUI.innerHTML = ""
                snap.forEach(childSnap => {
                    let key = childSnap.key,
                        value = childSnap.val()
                    let $li = document.createElement("li");
                    // edit icon
                    let editIconUI = document.createElement("span");
                    editIconUI.class = "edit-user";
                    editIconUI.innerHTML = " ✎";
                    editIconUI.setAttribute("userid", key);
                    editIconUI.addEventListener("click", this.editButtonClicked)
                        // delete icon
                    let deleteIconUI = document.createElement("span");
                    deleteIconUI.class = "delete-user";
                    deleteIconUI.innerHTML = " ☓";
                    deleteIconUI.setAttribute("userid", key);
                    deleteIconUI.addEventListener("click", this.deleteButtonClicked)

                    $li.innerHTML = value.name;
                    $li.append(editIconUI);
                    $li.append(deleteIconUI);

                    $li.setAttribute("user-key", key);
                    $li.addEventListener("click", this.userClicked)
                    userListUI.append($li);
                });
            })
        }
        // --------------------------
        // ADD
        // --------------------------

    addUserBtnClicked() {
            const usersRef = dbRef.child('users');
            const addUserInputsUI = document.getElementsByClassName("user-input");
            // this object will hold the new user information
            let newUser = {};
            // loop through View to get the data for the model 
            for (let i = 0, len = addUserInputsUI.length; i < len; i++) {
                let key = addUserInputsUI[i].getAttribute('data-key');
                let value = addUserInputsUI[i].value;
                newUser[key] = value;
            }
            usersRef.push(newUser)
        }
        // --------------------------
        // DELETE
        // --------------------------
    deleteButtonClicked(e) {
            e.stopPropagation();
            var userID = e.target.getAttribute("userid");
            const userRef = dbRef.child('users/' + userID);
            userRef.remove();
        }
        // --------------------------
        // EDIT
        // --------------------------
    editButtonClicked(e) {
        document.getElementById('edit-user-module').style.display = "block";
        //set user id to the hidden input field
        document.querySelector(".edit-userid").value = e.target.getAttribute("userid");
        const userRef = dbRef.child('users/' + e.target.getAttribute("userid"));
        // set data to the user field
        const editUserInputsUI = document.querySelectorAll(".edit-user-input");

        userRef.on("value", snap => {
            for (var i = 0, len = editUserInputsUI.length; i < len; i++) {
                var key = editUserInputsUI[i].getAttribute("data-key");
                editUserInputsUI[i].value = snap.val()[key];
            }

        });

    }
    saveUserBtnClicked(e) {
        const userID = document.querySelector(".edit-userid").value;
        const userRef = dbRef.child('users/' + userID);
        var editedUserObject = {}
        const editUserInputsUI = document.querySelectorAll(".edit-user-input");
        editUserInputsUI.forEach(function(textField) {
            let key = textField.getAttribute("data-key");
            let value = textField.value;
            editedUserObject[textField.getAttribute("data-key")] = textField.value
        });
        userRef.update(editedUserObject);
        document.getElementById('edit-user-module').style.display = "none";
    }

}
let inst = new FireBaseCrude();
const togglers = document.querySelectorAll('.toggler');
const searchButton = document.getElementById('search-button');
const input = document.getElementsByTagName('input');
const grandparent = document.querySelector('.grandparent');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const parentCheckboxes = document.querySelectorAll('.parent');
const childCheckboxes = document.querySelectorAll('.child');
const grandChild = document.querySelectorAll('.grandchild');
const labelElementArray = Array.from(document.querySelectorAll('label'));
const resultBox = document.querySelector(".result-box");
const inputBox = document.getElementById("input-box");
const chipsContainer = document.querySelector('.chips-container');
const clear = document.getElementById('clear-btn');

togglers.forEach(toggler => {
    toggler.addEventListener('click', (event) => {
        if (event.target.tagName === 'INPUT') {
            return;
        }
        toggler.classList.toggle('active');
        toggler.nextElementSibling.classList.toggle('active');
    })
})

clear.addEventListener('click', () => {
    grandparent.checked = false;
    updateChildren(grandparent, grandparent.checked);
    updateParents(grandparent);
    handleChipCreationForChildren(grandparent, grandparent.checked);
})



checkboxes.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
        updateChildren(checkbox, checkbox.checked);
        updateParents(checkbox);
        handleChipCreationForChildren(checkbox, checkbox.checked);
    });
});

function updateChildren(checkbox, isChecked) {
    let childrens;
    if (checkbox.parentElement.classList.contains('last')) {
        childrens = checkbox.parentElement.querySelector("input[type = 'checkbox']");
        childrens.checked = isChecked;
    }
    else {
        childrens = checkbox.parentElement.nextElementSibling.querySelectorAll("input[type = 'checkbox']");
        childrens.forEach(children => {
            children.checked = isChecked;
        });
    }
}

function handleChipCreationForChildren(checkbox, isChecked) {


    const label = checkbox.nextElementSibling.textContent.trim();
    const childrens = checkbox.parentElement.nextElementSibling?.querySelectorAll("input[type='checkbox']");

    if (isChecked) {
        createChip(label, checkbox);
    } else {
        removeChip(label);
    }

    if (checkbox.parentElement.classList.contains('last')) {
            return;
    }   
    else{
        childrens.forEach(childCheckbox => {
            childCheckbox.checked = isChecked;
            handleChipCreationForChildren(childCheckbox, isChecked);
        });
    }


}


//CORRECT CODE

// function handleChipCreationForChildren(checkbox, isChecked) {

//     const label = checkbox.nextElementSibling.textContent.trim();
//     const childrens = checkbox.parentElement.nextElementSibling?.querySelectorAll("input[type='checkbox']");

//     if (isChecked) {
//         createChip(label, checkbox);
//     } else {
//         removeChip(label);
//     }

//     if (childrens) {
//         childrens.forEach(childCheckbox => {
//             childCheckbox.checked = isChecked;
//             handleChipCreationForChildren(childCheckbox, isChecked);
//         });
//     }
// }

function updateParents(checkbox) {
    if (checkbox) {
        const grandparent = checkbox.parentElement.parentElement;
        // console.log("parent tagname\n", grandparent.tagName);
        const siblings = grandparent.querySelectorAll("ul > li input[type='checkbox']");
        const allChecked = Array.from(siblings).every(sib => sib.checked);
        const noneChecked = Array.from(siblings).every(sib => !sib.checked);
        const previousSibling = grandparent.previousElementSibling;
        if (previousSibling) {
            const upperCheckbox = previousSibling.querySelector("input[type = 'checkbox']");
            if (upperCheckbox) {
                if (allChecked) {
                    upperCheckbox.checked = true;
                }
                else {
                    upperCheckbox.checked = false;
                }
                previousSibling.classList.add('active');
                previousSibling.nextElementSibling.classList.add('active');

                updateParents(upperCheckbox);
            }
            else {
                console.log("element not found");
            }
        }
        else {
            console.log("Previous Sibling Not found");
        }
    }
}

inputBox.onkeyup = function (event) {
    let result = [];
    let input = inputBox.value;
    if (event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "Enter") {
        // handleKeyNavigation(event.key);
        // return;
        console.log("Working");
    }
    if (input.length) {
        result = labelElementArray.filter((val) => {
            // console.log("val = " + val);
            const Text = val.textContent;
            // console.log("Text = " + Text);
            // console.log("Text toLowercase = " + Text.toLowerCase());
            // console.log("Input toLowercase = " + input.toLowerCase());
            return Text.toLowerCase().includes(input.toLowerCase());
        });
        // console.log(result);
    }
    display(result);
    if (!result.length) {
        resultBox.innerHTML = "";
    }
}

function display(result) {
    const content = result.map((val) => {
        return "<li onclick = selectInput(this)>" + val.textContent + "</li>";
    });
    resultBox.innerHTML = "<ul>" + content.join(" ") + "</ul>";
}


function selectInput(text) {
    inputBox.value = text.textContent.trim();
    resultBox.innerHTML = "";
}

window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleSearch();
    }
})

searchButton.addEventListener('click', () => {
    handleSearch();
});

function handleSearch() {
    const textInput = inputBox.value;
    inputBox.value = '';
    labelElementArray.forEach(val => {
        if (val.textContent.toLowerCase() === textInput.toLowerCase()) {
            // console.log("Matched content = " + textInput);
            // console.log("Matched Parent Element = " + val);
            // console.log("Matched Parent Element parent Element= " + val.parentElement);
            const matchedCheckbox = val.parentElement.querySelector('input[type="checkbox"]');
            matchedCheckbox.checked = true;
            updateChildren(matchedCheckbox, matchedCheckbox.checked);
            updateParents(matchedCheckbox);
            handleChipCreationForChildren(matchedCheckbox, matchedCheckbox.checked);
            const mainelement = val.parentElement.parentElement;
            const valElement = val.parentElement;
            // console.log("Main element = " + mainelement);
            // console.log("Val element = " + valElement);
            if (valElement.classList.contains('toggler')) {
                // console.log("Contains toggler");
                valElement.classList.add('active');
                valElement.nextElementSibling.classList.add('active');
            }
        }
    })
}






function createChip(label, checkbox) {
    const existingChip = chipsContainer.querySelector(`[data-label="${label}"]`);

    if (!existingChip) {

        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.dataset.label = label;
        chip.innerHTML = `${label} <span class="chip-close" data-label="${label}">×</span>`;
        chipsContainer.appendChild(chip);

        chip.querySelector('.chip-close').addEventListener('click', () => {
            checkbox.checked = false;
            updateChildren(checkbox, false);
            updateParents(checkbox);
            handleChipCreationForChildren(checkbox, false);
        });
    }
}

function removeChip(label) {
    const chip = chipsContainer.querySelector(`[data-label="${label}"]`);
    if (chip) {
        chip.remove();
    }
}
characters = [];
var characterIndex = 0;
var round = 0;

function advance() {
    if (characters.length === 0) {
        return;
    }
    characterIndex++;
    if (characterIndex >= characters.length) {
        characterIndex = 0;
        round++;
    }
    characters.forEach(char => {
        char.meta.forEach(meta => {
            if (meta.duration && characterIndex == meta.creationIndex) {
                meta.duration--;
            }
        });
        char.meta = char.meta.filter(meta => meta.duration !== 0);
    });
    document.getElementById("round-counter").innerHTML = "Round: " + (round+1);
    renderCharacters();
}

function addCharacter() {
    var name = document.getElementById("new-char-name").value;
    var init = document.getElementById("new-char-init").value;

    if (!name || !init) {
        return;
    }

    characters.push({ name, init, meta:[] })

    document.getElementById("new-char-name").value = "";
    document.getElementById("new-char-init").value = "";

    renderCharacters();
}

function renderCharacters() {
    characters.sort((a, b) => {
        var diff = b.init - a.init;
        if (diff !== 0) {
            return diff;
        }
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });

    var chars = document.getElementById("characters");
    while (chars.firstChild) {
        chars.removeChild(chars.firstChild);
    }

    characters.forEach((char, index) => {
        var example = document.getElementById("character-example");
        var clone = example.cloneNode(true);
        clone.id = "character-" + char.name;
        if (index === characterIndex) {
            clone.classList.add("character-current");
        }
        chars.appendChild(clone);

        var charNameField = clone.getElementsByClassName("char-name")[0];
        charNameField.value = char.name;
        charNameField.onchange = () => {
            char.name = charNameField.value;
            renderCharacters();
        }

        var charInitField = clone.getElementsByClassName("char-init")[0];
        charInitField.value = char.init;
        charInitField.onchange = () => {
            char.init = charInitField.value;
            renderCharacters();
        }

        char.meta.forEach((meta, metaIndex) => {
            var metaExample = document.getElementById("metadata-example");
            var metaClone = metaExample.cloneNode(true);

            var metaDataField = metaClone.getElementsByClassName("meta-data")[0];
            metaDataField.value = meta.data;
            metaDataField.onchange = () => {
                meta.data = metaDataField.value;
                renderCharacters();
            }

            var metaDurationField = metaClone.getElementsByClassName("meta-duration")[0];
            metaDurationField.value = meta.duration;
            metaDurationField.onchange = () => {
                meta.duration = metaDurationField.value;
                renderCharacters();
            }

            metaClone.getElementsByClassName("delete-meta")[0].onclick = () => {
                char.meta.splice(metaIndex, 1);
                renderCharacters();
            };

            clone.appendChild(metaClone);
        });

        clone.getElementsByClassName("add-meta")[0].onclick = () => {
            char.meta.push({ data: "", creationIndex: characterIndex });
            renderCharacters();
        }

        clone.getElementsByClassName("delete-char")[0].onclick = () => {
            characters.splice(index, 1);
            renderCharacters();
        };
    });

    console.log(characters);
}
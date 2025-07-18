// mini1.js - Versión dinámica para varias carreras
document.addEventListener("DOMContentLoaded", async () => {
    const params = new URLSearchParams(window.location.search);
    const carrera = params.get("m");

    if (!carrera) {
        document.body.innerHTML = `<h2>Error: No se especificó la carrera en la URL.<br>
        Usa: ?m=ing_informatica_UNELLEZ</h2>`;
        return;
    }

    const dataFile = `data/data_${carrera}.json`;
    const colorsFile = `data/colors_${carrera}.json`;

    try {
        const [dataRes, colorsRes] = await Promise.all([
            fetch(dataFile),
            fetch(colorsFile)
        ]);

        if (!dataRes.ok || !colorsRes.ok) {
            throw new Error(`No se pudieron cargar los archivos para la carrera: ${carrera}`);
        }

        const mallaData = await dataRes.json();
        const colorsData = await colorsRes.json();

        renderMalla(mallaData, colorsData, carrera);
    } catch (error) {
        document.body.innerHTML = `<h2>Error cargando la malla: ${error.message}</h2>`;
        console.error(error);
    }
});

function renderMalla(malla, colores, carrera) {
    const container = document.getElementById("malla-container");
    if (!container) {
        console.error("No existe el contenedor con id 'malla-container'");
        return;
    }

    container.innerHTML = `<h2>Malla de ${carrera.replace(/_/g, " ")}</h2>`;

    for (let semestre in malla) {
        const semBlock = document.createElement("div");
        semBlock.classList.add("semestre");
        semBlock.innerHTML = `<h3>Semestre ${semestre.replace("s", "")}</h3>`;

        const list = document.createElement("ul");
        malla[semestre].forEach(materia => {
            const [nombre, codigo, uc, tipo, categoria] = materia;

            const li = document.createElement("li");
            li.textContent = `${nombre} (${uc} UC)`;
            li.style.backgroundColor = colores[categoria] ? colores[categoria][0] : "#ccc";
            li.title = `Código: ${codigo} | Categoría: ${categoria}`;
            list.appendChild(li);
        });

        semBlock.appendChild(list);
        container.appendChild(semBlock);
    }
}

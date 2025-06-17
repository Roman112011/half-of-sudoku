// Вибране число для вставки
let write = "";

// Початковий рівень складності
let sudokudiff = 35;

// Двовимірний масив 9x9 для судоку
let sudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(0));

// Масив ID клітинок з початковими числами
let generatedNumbersIds = new Set();

// Перевірка, чи всі комірки заповнені
function isTableFilled() {
    return sudokuGrid.every(row => row.every(cell => cell !== 0));
}

// Вибір числа для вставки
function number(numbers) {
    write = numbers;
    document.getElementById("number").style.fontSize = write ? "80px" : "65px";
    document.getElementById("number").textContent = `Number: ${numbers}`;
}

// Перевіряє можливість вставки числа
function canPlaceNumber(row, col, number) {
    if (sudokuGrid[row].includes(number)) return false;
    if (sudokuGrid.some(r => r[col] === number)) return false;

    let startRow = Math.floor(row / 3) * 3;
    let startCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (sudokuGrid[startRow + i][startCol + j] === number) return false;
        }
    }
    return true;
}
// Запускає ефект конфеті
function launchConfetti() {
    for (let i = 0; i < Math.floor(Math.random() * 5); i++) {
        for (let j = 0; j < 150; j++) {
            setTimeout(() => {
                let confetti = document.createElement("div");
                confetti.classList.add("confetti");
                document.body.appendChild(confetti);

                confetti.style.left = Math.random() * window.innerWidth + "px";
                confetti.style.top = Math.random() * -200 + "px";
                confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

                confetti.animate([
                    { top: Math.random() * -200 + "px" },
                    { top: window.innerHeight - 150 + "px", opacity: 0 }
                ], { duration: 3000 });

                setTimeout(() => confetti.remove(), 3000);
            }, Math.random() * 1000);
        }
    }
}

// Заповнює клітинку вибраним числом
function full(cellId) {
    let row = Math.floor((cellId - 1) / 9);
    let col = (cellId - 1) % 9;
    let cellElement = document.getElementById(`cell-${cellId}`);

    if (generatedNumbersIds.has(cellId)) { // Забороняємо зміну початкових чисел
        cellElement.style.backgroundColor = "red";
        setTimeout(() => cellElement.style.backgroundColor = "", 250);
        return;
    }

    if (!write) {
        cellElement.textContent = "";
        sudokuGrid[row][col] = 0;
    } else if (sudokuGrid[row][col] === 0) {
        if (canPlaceNumber(row, col, write)) {
            cellElement.textContent = write;
            sudokuGrid[row][col] = write;
        } else {
            cellElement.style.backgroundColor = "red";
            setTimeout(() => cellElement.style.backgroundColor = "", 250);
        }
    }

    if (isTableFilled()) {
        document.getElementById("end").style.display = "block";
        launchConfetti();
    }
}


// Генерує судоку
function generateSudoku() {
    sudokuGrid = Array.from({ length: 9 }, () => Array(9).fill(0));
    generatedNumbersIds.clear();

    fillSudoku(0, 0);
    removeNumbers(sudokudiff);

    // Зберігаємо початкові ID клітинок у `generatedNumbersIds`
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (sudokuGrid[row][col] !== 0) {
                let cellId = row * 9 + col + 1;
                generatedNumbersIds.add(cellId);
            }
        }
    }

    renderSudoku();
}

// Заповнює судоку рекурсивно
function fillSudoku(row, col) {
    if (row === 9) return true;

    let nextRow = col === 8 ? row + 1 : row;
    let nextCol = (col + 1) % 9;

    if (sudokuGrid[row][col] !== 0) return fillSudoku(nextRow, nextCol);

    let numbers = Array.from({ length: 9 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
    for (let num of numbers) {
        if (canPlaceNumber(row, col, num)) {
            sudokuGrid[row][col] = num;
            if (fillSudoku(nextRow, nextCol)) return true;
            sudokuGrid[row][col] = 0;
        }
    }

    return false;
}

// Видаляє числа для складності
function removeNumbers(difficulty = sudokudiff) {
    let count = 0;
    while (count < difficulty) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (sudokuGrid[row][col] !== 0) {
            sudokuGrid[row][col] = 0;
            count++;
        }
    }
}

// Відображає судоку
function renderSudoku() {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let cellId = row * 9 + col + 1;
            let cell = document.getElementById(`cell-${cellId}`);
            if (cell) {
                cell.textContent = sudokuGrid[row][col] !== 0 ? sudokuGrid[row][col] : "";
            }
        }
    }
    console.log(sudokuGrid);
}

// Змінює складність та генерує нову гру
function diff(selected) {
    sudokudiff = selected;
    generateSudoku();
}

// Запускає генерацію судоку після завантаження
document.addEventListener("DOMContentLoaded", generateSudoku);
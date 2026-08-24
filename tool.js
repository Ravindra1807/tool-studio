/* =========================================================
   PERSONAL UTILITY STUDIO
   COMPLETE SCRIPT
========================================================= */


/* =========================================================
   GLOBAL HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const state = {
    pdfToImageFile: null,
    imagePdfFiles: [],
    mergePdfFiles: [],
    splitPdfFile: null,
    reorderPdfFile: null,
    rotatePdfFile: null,
    compressPdfFile: null,

    imageConvertFiles: [],
    imageCompressFiles: [],
    imageResizeFiles: [],

    cropImage: null,
    rotateImage: null,
    flipImage: null,
    analyzerImage: null,

    stopwatchSeconds: 0,
    stopwatchInterval: null,

    timerSeconds: 300,
    timerInterval: null,

    recognition: null,
    voices: []
};


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast = $("toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(window.toastTimer);

    window.toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}


/* =========================================================
   FORMAT BYTES
========================================================= */

function formatBytes(bytes) {

    if (!bytes) return "0 Bytes";

    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB"
    ];

    const index = Math.floor(
        Math.log(bytes) / Math.log(1024)
    );

    return (
        bytes / Math.pow(1024, index)
    ).toFixed(index === 0 ? 0 : 2)
    + " "
    + units[index];
}


/* =========================================================
   DOWNLOAD BLOB
========================================================= */

function downloadBlob(blob, filename) {

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    a.remove();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    }, 1000);
}


/* =========================================================
   LOAD IMAGE
========================================================= */

function loadImage(file) {

    return new Promise((resolve, reject) => {

        const img = new Image();

        const url = URL.createObjectURL(file);

        img.onload = () => {

            URL.revokeObjectURL(url);

            resolve(img);
        };

        img.onerror = reject;

        img.src = url;
    });
}


/* =========================================================
   CANVAS → BLOB
========================================================= */

function canvasBlob(
    canvas,
    type = "image/png",
    quality = 0.9
) {

    return new Promise(resolve => {

        canvas.toBlob(
            resolve,
            type,
            quality
        );

    });
}


/* =========================================================
   FILE EXTENSION
========================================================= */

function extensionFromType(type) {

    if (type === "image/jpeg") return "jpg";

    if (type === "image/png") return "png";

    if (type === "image/webp") return "webp";

    return "bin";
}


/* =========================================================
   NAVIGATION
========================================================= */

const toolPages = document.querySelectorAll(".tool-page");

const navItems = document.querySelectorAll(".nav-item");


const pageTitles = {

    dashboard: [
        "Dashboard",
        "Your personal utility workspace"
    ],

    imageToPdf: [
        "Image → PDF",
        "Convert images into a professional PDF"
    ],

    pdfToImage: [
        "PDF → Image",
        "Convert PDF pages into images"
    ],

    pdfMerge: [
        "Merge PDF",
        "Combine multiple PDF files"
    ],

    pdfSplit: [
        "Split PDF",
        "Extract selected PDF pages"
    ],

    pdfReorder: [
        "Reorder PDF Pages",
        "Change the order of PDF pages"
    ],

    pdfRotate: [
        "Rotate PDF",
        "Rotate PDF pages"
    ],

    pdfCompress: [
        "Compress PDF",
        "Reduce PDF file size"
    ],

    pdfToText: [
        "PDF → Text",
        "Extract text from PDF"
    ],

    textToPdf: [
        "Text → PDF",
        "Create a PDF document from text"
    ],

    imageConverter: [
        "Image Converter",
        "Convert JPG, PNG and WebP"
    ],

    imageCompress: [
        "Compress Image",
        "Reduce image file size"
    ],

    imageResize: [
        "Resize Image",
        "Change image dimensions"
    ],

    imageCrop: [
        "Crop Image",
        "Crop your image"
    ],

    imageRotate: [
        "Rotate Image",
        "Rotate your image"
    ],

    imageFlip: [
        "Flip Image",
        "Flip your image"
    ],

    imageAnalyzer: [
        "Image Analyzer",
        "Analyze image properties"
    ],

    imageBase64: [
        "Image ↔ Base64",
        "Convert image to Base64"
    ],

    textEditor: [
        "Text Editor",
        "Write and edit text"
    ],

    textAnalyzer: [
        "Text Analyzer",
        "Analyze your text"
    ],

    textFormatter: [
        "Text Formatter",
        "Format your text"
    ],

    findReplace: [
        "Find & Replace",
        "Find and replace text"
    ],

    textToImage: [
        "Text → Image",
        "Create an image from text"
    ],

    translator: [
        "Translator",
        "Translate your text"
    ],

    textToSpeech: [
        "Text → Speech",
        "Convert text into speech"
    ],

    speechToText: [
        "Speech → Text",
        "Convert speech into text"
    ],

    jsonFormatter: [
        "JSON Formatter",
        "Format and validate JSON"
    ],

    base64: [
        "Base64 Encoder / Decoder",
        "Encode and decode Base64"
    ],

    urlEncoder: [
        "URL Encoder / Decoder",
        "Encode and decode URLs"
    ],

    regexTester: [
        "Regex Tester",
        "Test regular expressions"
    ],

    qrGenerator: [
        "QR Generator",
        "Generate QR codes"
    ],

    passwordGenerator: [
        "Password Generator",
        "Generate secure passwords"
    ],

    calculator: [
        "Calculator",
        "Simple calculator"
    ],

    percentage: [
        "Percentage Calculator",
        "Calculate percentages"
    ],

    ageCalculator: [
        "Age Calculator",
        "Calculate your age"
    ],

    unitConverter: [
        "Unit Converter",
        "Convert measurements"
    ],

    dateCalculator: [
        "Date Calculator",
        "Calculate date difference"
    ],

    stopwatch: [
        "Stopwatch",
        "Track elapsed time"
    ],

    timer: [
        "Countdown Timer",
        "Create a countdown"
    ]
};
 

function openTool(id) {

    toolPages.forEach(page => {
        page.classList.remove("active");
    });

    navItems.forEach(item => {
        item.classList.remove("active");
    });

    const page = $(id);

    const nav = document.querySelector(
        `.nav-item[data-tool="${id}"]`
    );

    if (page) {
        page.classList.add("active");
    }

    if (nav) {
        nav.classList.add("active");
    }

    if (pageTitles[id]) {

        $("pageTitle").textContent =
            pageTitles[id][0];

        $("pageDescription").textContent =
            pageTitles[id][1];
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


navItems.forEach(item => {

    item.addEventListener("click", () => {

        openTool(
            item.dataset.tool
        );

        if (window.innerWidth <= 767) {

            $("sidebar")
                ?.classList.remove(
                    "mobile-open"
                );

        }
    });

});


document
    .querySelectorAll("[data-open-tool]")
    .forEach(button => {

        button.addEventListener("click", () => {

            openTool(
                button.dataset.openTool
            );

        });

    });


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

if ($("mobileMenuBtn")) {

    $("mobileMenuBtn").onclick = () => {

        $("sidebar")
            ?.classList.toggle(
                "mobile-open"
            );

    };
}


/* =========================================================
   TOOL SEARCH
========================================================= */

if ($("toolSearch")) {

    $("toolSearch").addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .toLowerCase()
                    .trim();

            navItems.forEach(item => {

                const text =
                    item.textContent
                        .toLowerCase();

                item.style.display =
                    text.includes(value)
                        ? "flex"
                        : "none";
            });

        }
    );
}


/* =========================================================
   DARK MODE
========================================================= */

function setTheme(dark) {

    if (dark) {

        document.body.classList.add("dark");

        $("themeToggle").textContent = "☀️";

        localStorage.setItem(
            "utilityDarkMode",
            "true"
        );

    } else {

        document.body.classList.remove("dark");

        $("themeToggle").textContent = "🌙";

        localStorage.setItem(
            "utilityDarkMode",
            "false"
        );
    }
}


if (
    localStorage.getItem(
        "utilityDarkMode"
    ) === "true"
) {

    setTheme(true);
}


if ($("themeToggle")) {

    $("themeToggle").onclick = () => {

        setTheme(
            !document.body.classList.contains(
                "dark"
            )
        );

    };
}


/* =========================================================
   FILE INPUT BUTTON HELPER
========================================================= */

function connectButton(buttonId, inputId) {

    const button = $(buttonId);

    const input = $(inputId);

    if (!button || !input) return;

    button.onclick = () => {
        input.click();
    };
}


/* =========================================================
   CONNECT ALL FILE BUTTONS
========================================================= */

connectButton(
    "pdfToImageChoose",
    "pdfToImageInput"
);

connectButton(
    "imagePdfChoose",
    "imagePdfInput"
);

connectButton(
    "mergePdfChoose",
    "mergePdfInput"
);

connectButton(
    "splitPdfChoose",
    "splitPdfInput"
);

connectButton(
    "reorderPdfChoose",
    "reorderPdfInput"
);

connectButton(
    "rotatePdfChoose",
    "rotatePdfInput"
);

connectButton(
    "compressPdfChoose",
    "compressPdfInput"
);

connectButton(
    "pdfTextChoose",
    "pdfTextInput"
);

connectButton(
    "imageConvertChoose",
    "imageConvertInput"
);

connectButton(
    "imageCompressChoose",
    "imageCompressInput"
);

connectButton(
    "imageResizeChoose",
    "imageResizeInput"
);

connectButton(
    "cropImageChoose",
    "cropImageInput"
);

connectButton(
    "rotateImageChoose",
    "rotateImageInput"
);

connectButton(
    "flipImageChoose",
    "flipImageInput"
);

connectButton(
    "analyzerChoose",
    "analyzerInput"
);

connectButton(
    "base64ImageChoose",
    "base64ImageInput"
);


/* =========================================================
   DRAG & DROP
========================================================= */

function setupDropZone(
    zoneId,
    inputId,
    callback
) {

    const zone = $(zoneId);

    const input = $(inputId);

    if (!zone || !input) return;


    zone.addEventListener(
        "dragover",
        event => {

            event.preventDefault();

            zone.classList.add(
                "dragover"
            );

        }
    );


    zone.addEventListener(
        "dragleave",
        () => {

            zone.classList.remove(
                "dragover"
            );

        }
    );


    zone.addEventListener(
        "drop",
        event => {

            event.preventDefault();

            zone.classList.remove(
                "dragover"
            );

            callback(
                Array.from(
                    event.dataTransfer.files
                )
            );

        }
    );

}


/* =========================================================
   IMAGE → PDF
========================================================= */

function renderImagePdfFiles() {

    const box =
        $("imagePdfFiles");

    box.innerHTML = "";

    state.imagePdfFiles.forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "file-card";

            card.innerHTML = `

                <img
                    class="file-preview"
                    src="${URL.createObjectURL(file)}"
                >

                <button
                    class="remove-file"
                    data-index="${index}"
                >
                    ×
                </button>

                <div class="file-name">
                    ${file.name}
                </div>

                <div class="file-size">
                    ${formatBytes(file.size)}
                </div>

            `;

            card
                .querySelector(
                    ".remove-file"
                )
                .onclick = () => {

                    state.imagePdfFiles
                        .splice(index, 1);

                    renderImagePdfFiles();

                };

            box.appendChild(card);

        }
    );
}


function addImagePdfFiles(files) {

    const images =
        files.filter(file =>
            file.type.startsWith("image/")
        );

    state.imagePdfFiles.push(
        ...images
    );

    renderImagePdfFiles();
}


if ($("imagePdfInput")) {

    $("imagePdfInput").onchange =
        function () {

            addImagePdfFiles(
                Array.from(this.files)
            );

            this.value = "";

        };
}


setupDropZone(
    "imagePdfDrop",
    "imagePdfInput",
    addImagePdfFiles
);


/* =========================================================
   IMAGE → PDF CREATE
========================================================= */

if ($("createImagePdf")) {

    $("createImagePdf").onclick =
        async function () {

            if (
                state.imagePdfFiles.length === 0
            ) {

                showToast(
                    "Please add at least one image."
                );

                return;
            }


            if (!window.jspdf) {

                showToast(
                    "PDF library not loaded."
                );

                return;
            }


            const {
                jsPDF
            } = window.jspdf;


            const size =
                $("imagePdfPageSize").value;


            const orientation =
                $("imagePdfOrientation").value;


            const margin =
                Number(
                    $("imagePdfMargin").value
                );


            const quality =
                Number(
                    $("imagePdfQuality").value
                );


            const fit =
                $("imagePdfFit").value;


            const pdf =
                new jsPDF({

                    orientation,

                    unit: "mm",

                    format: size,

                    compress: true

                });


            for (
                let i = 0;
                i < state.imagePdfFiles.length;
                i++
            ) {

                if (i > 0) {
                    pdf.addPage(
                        size,
                        orientation
                    );
                }


                const file =
                    state.imagePdfFiles[i];


                const img =
                    await loadImage(file);


                const pageWidth =
                    pdf.internal.pageSize
                        .getWidth();


                const pageHeight =
                    pdf.internal.pageSize
                        .getHeight();


                const maxWidth =
                    pageWidth -
                    margin * 2;


                const maxHeight =
                    pageHeight -
                    margin * 2;


                const ratio =
                    img.width /
                    img.height;


                let width =
                    maxWidth;


                let height =
                    width / ratio;


                if (
                    fit === "contain"
                ) {

                    if (
                        height >
                        maxHeight
                    ) {

                        height =
                            maxHeight;

                        width =
                            height * ratio;
                    }

                } else {

                    height =
                        maxHeight;

                    width =
                        height * ratio;
                }


                const x =
                    (pageWidth - width) / 2;


                const y =
                    (pageHeight - height) / 2;


                let format = "JPEG";

                let dataUrl;


                if (
                    file.type === "image/png"
                ) {

                    format = "PNG";

                    dataUrl =
                        await fileToDataURL(
                            file
                        );

                } else {

                    dataUrl =
                        await imageToJpeg(
                            img,
                            quality
                        );

                }


                pdf.addImage(
                    dataUrl,
                    format,
                    x,
                    y,
                    width,
                    height
                );
            }


            let filename =
                $("imagePdfName")
                    .value
                    .trim() ||
                "images";


            filename =
                filename.replace(
                    /\.pdf$/i,
                    ""
                );


            pdf.save(
                filename + ".pdf"
            );


            incrementStat(
                "pdfProcessed"
            );

            showToast(
                "PDF created successfully!"
            );
        };
}


/* =========================================================
   FILE → DATA URL
========================================================= */

function fileToDataURL(file) {

    return new Promise(
        (resolve, reject) => {

            const reader =
                new FileReader();

            reader.onload =
                () => resolve(
                    reader.result
                );

            reader.onerror =
                reject;

            reader.readAsDataURL(file);
        }
    );
}


async function imageToJpeg(
    img,
    quality
) {

    const canvas =
        document.createElement(
            "canvas"
        );

    canvas.width =
        img.width;

    canvas.height =
        img.height;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.fillStyle =
        "#ffffff";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    ctx.drawImage(
        img,
        0,
        0
    );


    return canvas.toDataURL(
        "image/jpeg",
        quality
    );
}


/* =========================================================
   PDF → IMAGE
========================================================= */

let pdfjsReady = false;

async function loadPDFJS() {

    try {

        const module =
            await import(
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs"
            );


        window.pdfjsLib = module;


        window.pdfjsLib
            .GlobalWorkerOptions
            .workerSrc =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";


        pdfjsReady = true;

    } catch (error) {

        console.error(
            "PDF.js error:",
            error
        );

    }
}


loadPDFJS();


if ($("pdfToImageInput")) {

    $("pdfToImageInput").onchange =
        function () {

            state.pdfToImageFile =
                this.files[0] || null;


            if (
                state.pdfToImageFile
            ) {

                $("pdfToImageFile")
                    .innerHTML = `

                    <div>
                        📄
                        ${state.pdfToImageFile.name}
                        —
                        ${formatBytes(
                            state.pdfToImageFile.size
                        )}
                    </div>

                `;

            }

        };
}


setupDropZone(
    "pdfToImageDrop",
    "pdfToImageInput",
    files => {

        if (files[0]) {

            state.pdfToImageFile =
                files[0];

            $("pdfToImageFile")
                .innerHTML = `

                <div>
                    📄 ${files[0].name}
                </div>

            `;

        }

    }
);


function parsePages(
    text,
    totalPages
) {

    if (
        !text ||
        !text.trim()
    ) {

        return Array.from(
            { length: totalPages },
            (_, i) => i + 1
        );

    }


    const pages = new Set();


    text.split(",")
        .forEach(part => {

            part = part.trim();


            if (
                part.includes("-")
            ) {

                const [
                    start,
                    end
                ] =
                    part.split("-")
                        .map(Number);


                const from =
                    Math.max(
                        1,
                        Math.min(
                            start,
                            end
                        )
                    );


                const to =
                    Math.min(
                        totalPages,
                        Math.max(
                            start,
                            end
                        )
                    );


                for (
                    let i = from;
                    i <= to;
                    i++
                ) {

                    pages.add(i);

                }

            } else {

                const page =
                    Number(part);


                if (
                    page >= 1 &&
                    page <= totalPages
                ) {

                    pages.add(page);

                }

            }

        });


    return [...pages].sort(
        (a, b) => a - b
    );
}


if ($("pdfToImageInput")) {

    $("pdfToImageInput").onchange =
        function () {

            state.pdfToImageFile =
                this.files[0] || null;


            if (
                state.pdfToImageFile
            ) {

                $("pdfToImageFile")
                    .innerHTML = `

                    <div>
                        📄 ${state.pdfToImageFile.name}
                        <br>
                        ${formatBytes(
                            state.pdfToImageFile.size
                        )}
                    </div>

                `;

            }

        };
}


if ($("convertPdfToImage")) {

    $("convertPdfToImage").onclick =
        async function () {

            if (
                !state.pdfToImageFile
            ) {

                showToast(
                    "Choose a PDF first."
                );

                return;
            }


            if (!pdfjsReady) {

                showToast(
                    "PDF engine is loading. Try again."
                );

                return;
            }


            const data =
                await state.pdfToImageFile
                    .arrayBuffer();


            const pdf =
                await window.pdfjsLib
                    .getDocument({
                        data
                    })
                    .promise;


            const pages =
                parsePages(
                    $("pdfImagePages").value,
                    pdf.numPages
                );


            const format =
                $("pdfImageFormat").value;


            const scale =
                Number(
                    $("pdfImageScale").value
                );


            const quality =
                Number(
                    $("pdfImageQuality").value
                );


            const output =
                $("pdfToImageResults");


            output.innerHTML = "";


            for (
                const pageNumber
                of pages
            ) {

                const page =
                    await pdf.getPage(
                        pageNumber
                    );


                const viewport =
                    page.getViewport({
                        scale
                    });


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    Math.ceil(
                        viewport.width
                    );


                canvas.height =
                    Math.ceil(
                        viewport.height
                    );


                await page.render({

                    canvasContext:
                        canvas.getContext(
                            "2d"
                        ),

                    viewport

                }).promise;


                const mime =
                    format === "jpeg"
                        ? "image/jpeg"
                        : format === "webp"
                            ? "image/webp"
                            : "image/png";


                const blob =
                    await canvasBlob(
                        canvas,
                        mime,
                        quality
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "result-card";


                card.innerHTML = `

                    <img src="${url}">

                    <p>
                        Page ${pageNumber}
                        <br>
                        ${formatBytes(
                            blob.size
                        )}
                    </p>

                    <a
                        class="download-btn"
                        href="${url}"
                        download="page-${pageNumber}.${extensionFromType(mime)}"
                    >
                        Download
                    </a>

                `;


                output.appendChild(card);
            }


            incrementStat(
                "imagesProcessed",
                pages.length
            );


            showToast(
                "PDF converted successfully!"
            );

        };
}


/* =========================================================
   MERGE PDF
========================================================= */

function renderMergeFiles() {

    const box =
        $("mergePdfFiles");

    box.innerHTML = "";


    state.mergePdfFiles.forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "file-card";


            card.innerHTML = `

                <div
                    class="file-preview"
                    style="
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        font-size:45px;
                    "
                >
                    📄
                </div>

                <button
                    class="remove-file"
                >
                    ×
                </button>

                <div class="file-name">
                    ${file.name}
                </div>

                <div class="file-size">
                    ${formatBytes(file.size)}
                </div>

            `;


            card.querySelector(
                ".remove-file"
            ).onclick = () => {

                state.mergePdfFiles
                    .splice(index, 1);

                renderMergeFiles();

            };


            box.appendChild(card);

        }
    );
}


if ($("mergePdfInput")) {

    $("mergePdfInput").onchange =
        function () {

            state.mergePdfFiles.push(
                ...Array.from(this.files)
                    .filter(
                        file =>
                            file.type ===
                            "application/pdf"
                    )
            );


            renderMergeFiles();

            this.value = "";

        };
}


if ($("mergePdfButton")) {

    $("mergePdfButton").onclick =
        async function () {

            if (
                state.mergePdfFiles.length < 2
            ) {

                showToast(
                    "Select at least 2 PDF files."
                );

                return;
            }


            if (!window.PDFLib) {

                showToast(
                    "PDF library not loaded."
                );

                return;
            }


            const {
                PDFDocument
            } = window.PDFLib;


            const merged =
                await PDFDocument.create();


            for (
                const file
                of state.mergePdfFiles
            ) {

                const bytes =
                    await file.arrayBuffer();


                const source =
                    await PDFDocument.load(
                        bytes
                    );


                const pages =
                    await merged.copyPages(
                        source,
                        source.getPageIndices()
                    );


                pages.forEach(page => {

                    merged.addPage(page);

                });

            }


            const bytes =
                await merged.save();


            const blob =
                new Blob(
                    [bytes],
                    {
                        type:
                            "application/pdf"
                    }
                );


            let filename =
                $("mergePdfName")
                    .value
                    .trim() ||
                "merged";


            filename =
                filename.replace(
                    /\.pdf$/i,
                    ""
                );


            downloadBlob(
                blob,
                filename + ".pdf"
            );


            incrementStat(
                "pdfProcessed"
            );


            showToast(
                "PDFs merged successfully!"
            );

        };
}


/* =========================================================
   SPLIT PDF
========================================================= */

if ($("splitPdfInput")) {

    $("splitPdfInput").onchange =
        function () {

            state.splitPdfFile =
                this.files[0] || null;


            if (
                state.splitPdfFile
            ) {

                $("splitPdfFile")
                    .innerHTML = `

                    <div>
                        📄 ${state.splitPdfFile.name}
                    </div>

                `;

            }

        };
}


if ($("splitPdfButton")) {

    $("splitPdfButton").onclick =
        async function () {

            if (!state.splitPdfFile) {

                showToast(
                    "Choose a PDF first."
                );

                return;
            }


            const {
                PDFDocument
            } = window.PDFLib;


            const source =
                await PDFDocument.load(
                    await state.splitPdfFile
                        .arrayBuffer()
                );


            const pages =
                parsePages(
                    $("splitPages").value,
                    source.getPageCount()
                );


            const output =
                await PDFDocument.create();


            const copied =
                await output.copyPages(
                    source,
                    pages.map(
                        page => page - 1
                    )
                );


            copied.forEach(page => {

                output.addPage(page);

            });


            const bytes =
                await output.save();


            const blob =
                new Blob(
                    [bytes],
                    {
                        type:
                            "application/pdf"
                    }
                );


            downloadBlob(
                blob,
                "split-pages.pdf"
            );


            incrementStat(
                "pdfProcessed"
            );


            showToast(
                "PDF split successfully!"
            );

        };
}


/* =========================================================
   PDF ROTATE
========================================================= */

if ($("rotatePdfInput")) {

    $("rotatePdfInput").onchange =
        function () {

            state.rotatePdfFile =
                this.files[0] || null;

        };
}


if ($("rotatePdfButton")) {

    $("rotatePdfButton").onclick =
        async function () {

            if (!state.rotatePdfFile) {

                showToast(
                    "Choose a PDF first."
                );

                return;
            }


            const {
                PDFDocument,
                degrees
            } = window.PDFLib;


            const pdf =
                await PDFDocument.load(
                    await state.rotatePdfFile
                        .arrayBuffer()
                );


            const rotation =
                Number(
                    $("pdfRotation").value
                );


            const pages =
                parsePages(
                    $("rotatePdfPages").value,
                    pdf.getPageCount()
                );


            pages.forEach(pageNumber => {

                const page =
                    pdf.getPage(
                        pageNumber - 1
                    );


                const current =
                    page.getRotation().angle;


                page.setRotation(
                    degrees(
                        current + rotation
                    )
                );

            });


            const bytes =
                await pdf.save();


            const blob =
                new Blob(
                    [bytes],
                    {
                        type:
                            "application/pdf"
                    }
                );


            downloadBlob(
                blob,
                "rotated.pdf"
            );


            showToast(
                "PDF rotated!"
            );

        };
}


/* =========================================================
   PDF REORDER
========================================================= */

let reorderOrder = [];


if ($("reorderPdfInput")) {

    $("reorderPdfInput").onchange =
        async function () {

            state.reorderPdfFile =
                this.files[0] || null;


            if (
                state.reorderPdfFile
            ) {

                await renderReorderPages();

            }

        };
}


async function renderReorderPages() {

    if (!pdfjsReady) {

        showToast(
            "PDF engine is loading."
        );

        return;
    }


    const data =
        await state.reorderPdfFile
            .arrayBuffer();


    const pdf =
        await window.pdfjsLib
            .getDocument({
                data
            })
            .promise;


    reorderOrder =
        Array.from(
            {
                length:
                    pdf.numPages
            },
            (_, i) => i + 1
        );


    const container =
        $("reorderPages");


    container.innerHTML = "";


    for (
        let i = 1;
        i <= pdf.numPages;
        i++
    ) {

        const page =
            await pdf.getPage(i);


        const viewport =
            page.getViewport({
                scale: 0.35
            });


        const canvas =
            document.createElement(
                "canvas"
            );


        canvas.width =
            viewport.width;

        canvas.height =
            viewport.height;


        await page.render({

            canvasContext:
                canvas.getContext(
                    "2d"
                ),

            viewport

        }).promise;


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "page-preview";


        card.draggable = true;

        card.dataset.page = i;


        card.innerHTML = `
            <span>Page ${i}</span>
        `;


        card.prepend(canvas);


        container.appendChild(card);

    }


    enablePageDragAndDrop();

}


function enablePageDragAndDrop() {

    const container =
        $("reorderPages");


    let dragged = null;


    container
        .querySelectorAll(
            ".page-preview"
        )
        .forEach(card => {

            card.addEventListener(
                "dragstart",
                () => {

                    dragged = card;

                }
            );


            card.addEventListener(
                "dragover",
                event => {

                    event.preventDefault();

                }
            );


            card.addEventListener(
                "drop",
                event => {

                    event.preventDefault();

                    if (
                        dragged &&
                        dragged !== card
                    ) {

                        const all =
                            [
                                ...container
                                    .children
                            ];


                        const from =
                            all.indexOf(
                                dragged
                            );


                        const to =
                            all.indexOf(
                                card
                            );


                        if (from < to) {

                            container.insertBefore(
                                dragged,
                                card.nextSibling
                            );

                        } else {

                            container.insertBefore(
                                dragged,
                                card
                            );

                        }

                    }

                }
            );

        });

}


if ($("saveReorderedPdf")) {

    $("saveReorderedPdf").onclick =
        async function () {

            if (!state.reorderPdfFile) {

                showToast(
                    "Choose a PDF first."
                );

                return;
            }


            const {
                PDFDocument
            } = window.PDFLib;


            const source =
                await PDFDocument.load(
                    await state.reorderPdfFile
                        .arrayBuffer()
                );


            const output =
                await PDFDocument.create();


            const pageNumbers =
                [
                    ...$("reorderPages")
                        .querySelectorAll(
                            ".page-preview"
                        )
                ]
                .map(
                    card =>
                        Number(
                            card.dataset.page
                        )
                );


            const pages =
                await output.copyPages(
                    source,
                    pageNumbers.map(
                        p => p - 1
                    )
                );


            pages.forEach(page => {

                output.addPage(page);

            });


            const bytes =
                await output.save();


            downloadBlob(
                new Blob(
                    [bytes],
                    {
                        type:
                            "application/pdf"
                    }
                ),
                "reordered.pdf"
            );


            showToast(
                "PDF reordered!"
            );

        };
}


/* =========================================================
   PDF TEXT EXTRACTION
========================================================= */

if ($("pdfTextInput")) {

    $("pdfTextInput").onchange =
        async function () {

            const file =
                this.files[0];

            if (!file) return;


            if (!pdfjsReady) {

                showToast(
                    "PDF engine is loading."
                );

                return;
            }


            const data =
                await file.arrayBuffer();


            const pdf =
                await window.pdfjsLib
                    .getDocument({
                        data
                    })
                    .promise;


            let fullText = "";


            for (
                let i = 1;
                i <= pdf.numPages;
                i++
            ) {

                const page =
                    await pdf.getPage(i);


                const content =
                    await page.getTextContent();


                const text =
                    content.items
                        .map(
                            item =>
                                item.str
                        )
                        .join(" ");


                fullText +=
                    `\n\n--- Page ${i} ---\n\n`
                    + text;

            }


            $("pdfTextOutput")
                .value =
                fullText.trim();


            showToast(
                "Text extracted!"
            );

        };
}


if ($("copyPdfText")) {

    $("copyPdfText").onclick =
        async () => {

            await navigator.clipboard.writeText(
                $("pdfTextOutput").value
            );

            showToast("Copied!");
        };
}


if ($("downloadPdfText")) {

    $("downloadPdfText").onclick =
        () => {

            const blob =
                new Blob(
                    [
                        $("pdfTextOutput")
                            .value
                    ],
                    {
                        type:
                            "text/plain"
                    }
                );


            downloadBlob(
                blob,
                "extracted-text.txt"
            );

        };
}


/* =========================================================
   TEXT → PDF
========================================================= */

if ($("createTextPdf")) {

    $("createTextPdf").onclick =
        function () {

            const text =
                $("textPdfInput").value;


            if (!text.trim()) {

                showToast(
                    "Enter some text first."
                );

                return;
            }


            const {
                jsPDF
            } = window.jspdf;


            const pdf =
                new jsPDF({
                    format:
                        $("textPdfPageSize")
                            .value
                });


            const fontSize =
                Number(
                    $("textPdfFontSize").value
                ) || 12;


            pdf.setFontSize(
                fontSize
            );


            const pageWidth =
                pdf.internal.pageSize
                    .getWidth();


            const pageHeight =
                pdf.internal.pageSize
                    .getHeight();


            const margin = 20;


            const maxWidth =
                pageWidth -
                margin * 2;


            const lines =
                pdf.splitTextToSize(
                    text,
                    maxWidth
                );


            let y = margin;


            const lineHeight =
                fontSize * 0.45;


            lines.forEach(line => {

                if (
                    y >
                    pageHeight - margin
                ) {

                    pdf.addPage();

                    y = margin;

                }


                pdf.text(
                    line,
                    margin,
                    y
                );


                y += lineHeight;

            });


            let filename =
                $("textPdfName")
                    .value
                    .trim() ||
                "document";


            filename =
                filename.replace(
                    /\.pdf$/i,
                    ""
                );


            pdf.save(
                filename + ".pdf"
            );


            incrementStat(
                "pdfProcessed"
            );


            showToast(
                "PDF created!"
            );

        };
}


/* =========================================================
   IMAGE CONVERTER
========================================================= */

function renderImageConvertFiles() {

    renderSimpleImageFiles(
        state.imageConvertFiles,
        $("imageConvertFiles"),
        files => {

            state.imageConvertFiles =
                files;

            renderImageConvertFiles();

        }
    );
}


function renderSimpleImageFiles(
    files,
    container,
    onChange
) {

    container.innerHTML = "";


    files.forEach(
        (file, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "file-card";


            const url =
                URL.createObjectURL(
                    file
                );


            card.innerHTML = `

                <img
                    class="file-preview"
                    src="${url}"
                >

                <button
                    class="remove-file"
                >
                    ×
                </button>

                <div class="file-name">
                    ${file.name}
                </div>

                <div class="file-size">
                    ${formatBytes(file.size)}
                </div>

            `;


            card.querySelector(
                ".remove-file"
            ).onclick = () => {

                const newFiles =
                    files.filter(
                        (_, i) =>
                            i !== index
                    );

                onChange(newFiles);

            };


            container.appendChild(
                card
            );

        }
    );
}


if ($("imageConvertInput")) {

    $("imageConvertInput").onchange =
        function () {

            state.imageConvertFiles.push(
                ...Array.from(
                    this.files
                )
            );

            renderImageConvertFiles();

            this.value = "";

        };
}


if ($("convertImages")) {

    $("convertImages").onclick =
        async function () {

            if (
                state.imageConvertFiles
                    .length === 0
            ) {

                showToast(
                    "Choose images first."
                );

                return;
            }


            const format =
                $("imageConvertFormat")
                    .value;


            const quality =
                Number(
                    $("imageConvertQuality")
                        .value
                );


            const results =
                $("imageConvertResults");


            results.innerHTML = "";


            for (
                const file
                of state.imageConvertFiles
            ) {

                const img =
                    await loadImage(file);


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    img.width;

                canvas.height =
                    img.height;


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                if (
                    format ===
                    "image/jpeg"
                ) {

                    ctx.fillStyle =
                        "#ffffff";

                    ctx.fillRect(
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                }


                ctx.drawImage(
                    img,
                    0,
                    0
                );


                const blob =
                    await canvasBlob(
                        canvas,
                        format,
                        quality
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                const extension =
                    extensionFromType(
                        format
                    );


                const filename =
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ) +
                    "." +
                    extension;


                createImageResult(
                    results,
                    blob,
                    filename,
                    url
                );

            }


            incrementStat(
                "imagesProcessed",
                state.imageConvertFiles.length
            );


            showToast(
                "Images converted!"
            );

        };
}


/* =========================================================
   RESULT CARD
========================================================= */

function createImageResult(
    container,
    blob,
    filename,
    url
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "result-card";


    card.innerHTML = `

        <img
            src="${url}"
            alt=""
        >

        <p>
            ${filename}
            <br>
            ${formatBytes(blob.size)}
        </p>

        <a
            class="download-btn"
            href="${url}"
            download="${filename}"
        >
            Download
        </a>

    `;


    container.appendChild(card);
}


/* =========================================================
   IMAGE COMPRESS
========================================================= */

if ($("imageCompressInput")) {

    $("imageCompressInput").onchange =
        function () {

            state.imageCompressFiles.push(
                ...Array.from(
                    this.files
                )
            );

            renderSimpleImageFiles(
                state.imageCompressFiles,
                $("imageCompressFiles"),
                files => {

                    state.imageCompressFiles =
                        files;

                    renderSimpleImageFiles(
                        state.imageCompressFiles,
                        $("imageCompressFiles"),
                        arguments
                    );

                }
            );

            this.value = "";

        };
}


if ($("compressImages")) {

    $("compressImages").onclick =
        async function () {

            if (
                state.imageCompressFiles
                    .length === 0
            ) {

                showToast(
                    "Choose images first."
                );

                return;
            }


            const quality =
                Number(
                    $("imageCompressQuality")
                        .value
                );


            const results =
                $("imageCompressResults");


            results.innerHTML = "";


            for (
                const file
                of state.imageCompressFiles
            ) {

                const img =
                    await loadImage(file);


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width =
                    img.width;

                canvas.height =
                    img.height;


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                ctx.fillStyle =
                    "#ffffff";


                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                ctx.drawImage(
                    img,
                    0,
                    0
                );


                const blob =
                    await canvasBlob(
                        canvas,
                        "image/jpeg",
                        quality
                    );


                const url =
                    URL.createObjectURL(
                        blob
                    );


                createImageResult(
                    results,
                    blob,
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ) + "-compressed.jpg",
                    url
                );

            }


            incrementStat(
                "imagesProcessed",
                state.imageCompressFiles.length
            );


            showToast(
                "Images compressed!"
            );

        };
}


/* =========================================================
   QUALITY OUTPUTS
========================================================= */

function connectRangeOutput(
    inputId,
    outputId,
    suffix = "%"
) {

    const input = $(inputId);

    const output = $(outputId);

    if (!input || !output) return;


    const update = () => {

        const value =
            Number(input.value);


        const display =
            suffix === "%"
                ? Math.round(
                    value * 100
                )
                : value;


        output.textContent =
            display + suffix;

    };


    input.addEventListener(
        "input",
        update
    );


    update();
}


connectRangeOutput(
    "pdfImageQuality",
    "pdfImageQualityOutput"
);

connectRangeOutput(
    "imagePdfQuality",
    "imagePdfQualityOutput"
);

connectRangeOutput(
    "imageCompressQuality",
    "imageCompressQualityOutput"
);

connectRangeOutput(
    "pdfCompressionLevel",
    "pdfCompressionOutput"
);


/* =========================================================
   IMAGE RESIZE
========================================================= */

if ($("imageResizeInput")) {

    $("imageResizeInput").onchange =
        function () {

            state.imageResizeFiles.push(
                ...Array.from(
                    this.files
                )
            );


            renderSimpleImageFiles(
                state.imageResizeFiles,
                $("imageResizeFiles"),
                files => {

                    state.imageResizeFiles =
                        files;

                    renderSimpleImageFiles(
                        state.imageResizeFiles,
                        $("imageResizeFiles"),
                        () => {}
                    );

                }
            );


            this.value = "";

        };
}


if ($("resizeImages")) {

    $("resizeImages").onclick =
        async function () {

            if (
                state.imageResizeFiles
                    .length === 0
            ) {

                showToast(
                    "Choose images first."
                );

                return;
            }


            const width =
                Number(
                    $("resizeWidth").value
                );


            const height =
                Number(
                    $("resizeHeight").value
                );


            if (
                !width &&
                !height
            ) {

                showToast(
                    "Enter width or height."
                );

                return;
            }


            const keepRatio =
                $("resizeRatio").value ===
                "yes";


            const results =
                $("imageResizeResults");


            results.innerHTML = "";


            for (
                const file
                of state.imageResizeFiles
            ) {

                const img =
                    await loadImage(file);


                let w = width ||
                    img.width;


                let h = height ||
                    img.height;


                if (keepRatio) {

                    if (
                        width &&
                        !height
                    ) {

                        h =
                            Math.round(
                                img.height *
                                (
                                    width /
                                    img.width
                                )
                            );

                    } else if (
                        height &&
                        !width
                    ) {

                        w =
                            Math.round(
                                img.width *
                                (
                                    height /
                                    img.height
                                )
                            );

                    } else {

                        const ratio =
                            Math.min(
                                width /
                                img.width,
                                height /
                                img.height
                            );


                        w =
                            Math.round(
                                img.width *
                                ratio
                            );


                        h =
                            Math.round(
                                img.height *
                                ratio
                            );

                    }

                }


                const canvas =
                    document.createElement(
                        "canvas"
                    );


                canvas.width = w;

                canvas.height = h;


                const ctx =
                    canvas.getContext(
                        "2d"
                    );


                ctx.drawImage(
                    img,
                    0,
                    0,
                    w,
                    h
                );


                const blob =
                    await canvasBlob(
                        canvas,
                        "image/png"
                    );


                createImageResult(
                    results,
                    blob,
                    file.name.replace(
                        /\.[^/.]+$/,
                        ""
                    ) +
                    `-${w}x${h}.png`,
                    URL.createObjectURL(
                        blob
                    )
                );

            }


            incrementStat(
                "imagesProcessed",
                state.imageResizeFiles.length
            );


            showToast(
                "Images resized!"
            );

        };
}


/* =========================================================
   IMAGE CROP
========================================================= */

if ($("cropImageInput")) {

    $("cropImageInput").onchange =
        async function () {

            const file =
                this.files[0];

            if (!file) return;


            state.cropImage =
                await loadImage(file);


            $("cropWorkspace")
                .innerHTML = "";


            const img =
                state.cropImage
                    .cloneNode();


            img.src =
                state.cropImage.src;


            $("cropWorkspace")
                .appendChild(
                    state.cropImage
                );


            $("cropWidth").value =
                state.cropImage.width;


            $("cropHeight").value =
                state.cropImage.height;

        };
}


if ($("cropImageButton")) {

    $("cropImageButton").onclick =
        async function () {

            if (!state.cropImage) {

                showToast(
                    "Choose an image first."
                );

                return;
            }


            const x =
                Number(
                    $("cropX").value
                );


            const y =
                Number(
                    $("cropY").value
                );


            const width =
                Number(
                    $("cropWidth").value
                );


            const height =
                Number(
                    $("cropHeight").value
                );


            if (
                width <= 0 ||
                height <= 0
            ) {

                showToast(
                    "Enter valid crop dimensions."
                );

                return;
            }


            const canvas =
                document.createElement(
                    "canvas"
                );


            canvas.width = width;

            canvas.height = height;


            const ctx =
                canvas.getContext(
                    "2d"
                );


            ctx.drawImage(
                state.cropImage,
                x,
                y,
                width,
                height,
                0,
                0,
                width,
                height
            );


            const blob =
                await canvasBlob(
                    canvas,
                    "image/png"
                );


            createImageResult(
                $("cropResults"),
                blob,
                "cropped-image.png",
                URL.createObjectURL(blob)
            );


            showToast(
                "Image cropped!"
            );

        };
}


/* =========================================================
   IMAGE ROTATE
========================================================= */

if ($("rotateImageInput")) {

    $("rotateImageInput").onchange =
        async function () {

            state.rotateImage =
                await loadImage(
                    this.files[0]
                );

        };
}


if ($("rotateImageButton")) {

    $("rotateImageButton").onclick =
        async function () {

            if (!state.rotateImage) {

                showToast(
                    "Choose an image."
                );

                return;
            }


            const angle =
                Number(
                    $("imageRotation").value
                );


            const radians =
                angle *
                Math.PI /
                180;


            const img =
                state.rotateImage;


            const canvas =
                document.createElement(
                    "canvas"
                );


            if (
                angle === 90 ||
                angle === 270
            ) {

                canvas.width =
                    img.height;

                canvas.height =
                    img.width;

            } else {

                canvas.width =
                    img.width;

                canvas.height =
                    img.height;

            }


            const ctx =
                canvas.getContext(
                    "2d"
                );


            ctx.translate(
                canvas.width / 2,
                canvas.height / 2
            );


            ctx.rotate(radians);


            ctx.drawImage(
                img,
                -img.width / 2,
                -img.height / 2
            );


            const blob =
                await canvasBlob(
                    canvas,
                    "image/png"
                );


            createImageResult(
                $("rotateImageResults"),
                blob,
                "rotated-image.png",
                URL.createObjectURL(blob)
            );


            showToast(
                "Image rotated!"
            );

        };
}


/* =========================================================
   IMAGE FLIP
========================================================= */

let flipImageObject = null;


if ($("flipImageInput")) {

    $("flipImageInput").onchange =
        async function () {

            flipImageObject =
                await loadImage(
                    this.files[0]
                );

        };
}


async function flipImage(
    horizontal,
    vertical
) {

    if (!flipImageObject) {

        showToast(
            "Choose an image."
        );

        return;
    }


    const img =
        flipImageObject;


    const canvas =
        document.createElement(
            "canvas"
        );


    canvas.width =
        img.width;

    canvas.height =
        img.height;


    const ctx =
        canvas.getContext(
            "2d"
        );


    ctx.translate(
        horizontal
            ? img.width
            : 0,
        vertical
            ? img.height
            : 0
    );


    ctx.scale(
        horizontal ? -1 : 1,
        vertical ? -1 : 1
    );


    ctx.drawImage(
        img,
        0,
        0
    );


    const blob =
        await canvasBlob(
            canvas,
            "image/png"
        );


    createImageResult(
        $("flipImageResults"),
        blob,
        "flipped-image.png",
        URL.createObjectURL(blob)
    );

}


if ($("flipHorizontal")) {

    $("flipHorizontal").onclick =
        () => flipImage(true, false);

}


if ($("flipVertical")) {

    $("flipVertical").onclick =
        () => flipImage(false, true);

}


/* =========================================================
   IMAGE ANALYZER
========================================================= */

if ($("analyzerInput")) {

    $("analyzerInput").onchange =
        async function () {

            const file =
                this.files[0];

            if (!file) return;


            const img =
                await loadImage(file);


            const pixels =
                img.width *
                img.height;


            const ratio =
                (
                    img.width /
                    img.height
                ).toFixed(2);


            $("imageAnalysis")
                .innerHTML = `

                <div>
                    <strong>
                        ${img.width} × ${img.height}
                    </strong>
                    <span>
                        Dimensions
                    </span>
                </div>

                <div>
                    <strong>
                        ${formatBytes(file.size)}
                    </strong>
                    <span>
                        File Size
                    </span>
                </div>

                <div>
                    <strong>
                        ${file.type}
                    </strong>
                    <span>
                        Format
                    </span>
                </div>

                <div>
                    <strong>
                        ${ratio}
                    </strong>
                    <span>
                        Aspect Ratio
                    </span>
                </div>

                <div>
                    <strong>
                        ${pixels.toLocaleString()}
                    </strong>
                    <span>
                        Pixels
                    </span>
                </div>

                <div>
                    <strong>
                        ${img.width >= 1920 ? "High" : "Standard"}
                    </strong>
                    <span>
                        Resolution
                    </span>
                </div>

            `;


            showToast(
                "Image analyzed!"
            );

        };
}


/* =========================================================
   IMAGE BASE64
========================================================= */

if ($("base64ImageInput")) {

    $("base64ImageInput").onchange =
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    $("imageBase64Output")
                        .value =
                        event.target.result;

                };


            reader.readAsDataURL(
                file
            );

        };
}


if ($("copyImageBase64")) {

    $("copyImageBase64").onclick =
        async () => {

            await navigator.clipboard.writeText(
                $("imageBase64Output")
                    .value
            );

            showToast("Copied!");
        };
}


if ($("downloadImageBase64")) {

    $("downloadImageBase64").onclick =
        () => {

            const blob =
                new Blob(
                    [
                        $("imageBase64Output")
                            .value
                    ],
                    {
                        type:
                            "text/plain"
                    }
                );


            downloadBlob(
                blob,
                "image-base64.txt"
            );

        };
}


/* =========================================================
   TEXT EDITOR
========================================================= */

function wrapSelectedText(
    before,
    after
) {

    const textarea =
        $("editorText");


    const start =
        textarea.selectionStart;


    const end =
        textarea.selectionEnd;


    const selected =
        textarea.value.substring(
            start,
            end
        );


    textarea.value =
        textarea.value.substring(
            0,
            start
        ) +
        before +
        selected +
        after +
        textarea.value.substring(
            end
        );


    textarea.focus();

}


if ($("boldText")) {

    $("boldText").onclick =
        () => {

            wrapSelectedText(
                "**",
                "**"
            );

        };
}


if ($("italicText")) {

    $("italicText").onclick =
        () => {

            wrapSelectedText(
                "*",
                "*"
            );

        };
}


if ($("underlineText")) {

    $("underlineText").onclick =
        () => {

            wrapSelectedText(
                "<u>",
                "</u>"
            );

        };
}


if ($("uppercaseText")) {

    $("uppercaseText").onclick =
        () => {

            $("editorText").value =
                $("editorText")
                    .value
                    .toUpperCase();

            updateEditorInfo();

        };
}


if ($("lowercaseText")) {

    $("lowercaseText").onclick =
        () => {

            $("editorText").value =
                $("editorText")
                    .value
                    .toLowerCase();

            updateEditorInfo();

        };
}


if ($("clearText")) {

    $("clearText").onclick =
        () => {

            $("editorText").value = "";

            updateEditorInfo();

        };
}


function updateEditorInfo() {

    const text =
        $("editorText").value;


    const words =
        text.trim()
            ? text.trim()
                .split(/\s+/)
                .length
            : 0;


    $("editorInfo").textContent =
        `${words} words • ${text.length} characters`;

}


if ($("editorText")) {

    $("editorText").addEventListener(
        "input",
        updateEditorInfo
    );

}


/* =========================================================
   TEXT ANALYZER
========================================================= */

if ($("analyzerText")) {

    $("analyzerText").addEventListener(
        "input",
        analyzeText
    );

}


function analyzeText() {

    const text =
        $("analyzerText").value;


    const words =
        text.trim()
            ? text.trim()
                .split(/\s+/)
                .length
            : 0;


    const characters =
        text.length;


    const noSpaces =
        text.replace(
            /\s/g,
            ""
        ).length;


    const lines =
        text
            ? text.split("\n").length
            : 0;


    const sentences =
        text.trim()
            ? text.split(
                /[.!?]+/
            ).filter(Boolean).length
            : 0;


    const reading =
        Math.max(
            1,
            Math.ceil(
                words / 200
            )
        );


    $("textAnalysis")
        .innerHTML = `

        <div>
            <strong>${words}</strong>
            <span>Words</span>
        </div>

        <div>
            <strong>${characters}</strong>
            <span>Characters</span>
        </div>

        <div>
            <strong>${noSpaces}</strong>
            <span>Without Spaces</span>
        </div>

        <div>
            <strong>${sentences}</strong>
            <span>Sentences</span>
        </div>

        <div>
            <strong>${lines}</strong>
            <span>Lines</span>
        </div>

        <div>
            <strong>${reading} min</strong>
            <span>Reading Time</span>
        </div>

    `;

}


/* =========================================================
   TEXT FORMATTER
========================================================= */

if ($("formatUppercase")) {

    $("formatUppercase").onclick =
        () => {

            $("formatterOutput").value =
                $("formatterInput")
                    .value
                    .toUpperCase();

        };
}


if ($("formatLowercase")) {

    $("formatLowercase").onclick =
        () => {

            $("formatterOutput").value =
                $("formatterInput")
                    .value
                    .toLowerCase();

        };
}


if ($("capitalizeText")) {

    $("capitalizeText").onclick =
        () => {

            $("formatterOutput").value =
                $("formatterInput")
                    .value
                    .toLowerCase()
                    .replace(
                        /\b\w/g,
                        char =>
                            char.toUpperCase()
                    );

        };
}


if ($("removeSpaces")) {

    $("removeSpaces").onclick =
        () => {

            $("formatterOutput").value =
                $("formatterInput")
                    .value
                    .replace(
                        /[ \t]+/g,
                        " "
                    )
                    .trim();

        };
}


if ($("removeDuplicates")) {

    $("removeDuplicates").onclick =
        () => {

            const lines =
                $("formatterInput")
                    .value
                    .split("\n");


            $("formatterOutput").value =
                [
                    ...new Set(lines)
                ].join("\n");

        };
}


if ($("sortTextLines")) {

    $("sortTextLines").onclick =
        () => {

            const lines =
                $("formatterInput")
                    .value
                    .split("\n");


            lines.sort(
                (a, b) =>
                    a.localeCompare(b)
            );


            $("formatterOutput").value =
                lines.join("\n");

        };
}


/* =========================================================
   FIND & REPLACE
========================================================= */

if ($("replaceAll")) {

    $("replaceAll").onclick =
        () => {

            const text =
                $("findReplaceText")
                    .value;


            const find =
                $("findText")
                    .value;


            const replace =
                $("replaceText")
                    .value;


            if (!find) {

                showToast(
                    "Enter text to find."
                );

                return;
            }


            $("findReplaceText")
                .value =
                text.split(find)
                    .join(replace);

            showToast(
                "Replacement completed!"
            );

        };
}


/* =========================================================
   TEXT → IMAGE
========================================================= */

if ($("createTextImage")) {

    $("createTextImage").onclick =
        async function () {

            const text =
                $("textImageInput")
                    .value;


            if (!text.trim()) {

                showToast(
                    "Enter some text."
                );

                return;
            }


            const fontSize =
                Number(
                    $("textImageFontSize")
                        .value
                ) || 32;


            const background =
                $("textImageBackground")
                    .value;


            const color =
                $("textImageColor")
                    .value;


            const canvas =
                document.createElement(
                    "canvas"
                );


            const ctx =
                canvas.getContext(
                    "2d"
                );


            const lines =
                text.split("\n");


            const padding = 50;

            const lineHeight =
                fontSize * 1.5;


            canvas.width = 1200;

            canvas.height =
                Math.max(
                    200,
                    padding * 2 +
                    lines.length *
                    lineHeight
                );


            ctx.fillStyle =
                background;


            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            ctx.fillStyle =
                color;


            ctx.font =
                `${fontSize}px Arial`;


            ctx.textBaseline =
                "top";


            lines.forEach(
                (line, index) => {

                    ctx.fillText(
                        line,
                        padding,
                        padding +
                        index *
                        lineHeight
                    );

                }
            );


            $("textImagePreview")
                .innerHTML = "";


            $("textImagePreview")
                .appendChild(
                    canvas
                );


            const blob =
                await canvasBlob(
                    canvas,
                    "image/png"
                );


            const button =
                document.createElement(
                    "a"
                );


            button.className =
                "download-btn";


            button.textContent =
                "Download Image";


            button.href =
                URL.createObjectURL(
                    blob
                );


            button.download =
                "text-image.png";


            $("textImagePreview")
                .appendChild(
                    button
                );


            showToast(
                "Image created!"
            );

        };
}


/* =========================================================
   TRANSLATOR
========================================================= */

if ($("swapLanguage")) {

    $("swapLanguage").onclick =
        () => {

            const source =
                $("sourceLanguage");


            const target =
                $("targetLanguage");


            if (
                source.value === "auto"
            ) {

                source.value = "en";

            }


            const old =
                source.value;


            source.value =
                target.value;


            target.value =
                old;


            const input =
                $("translateInput")
                    .value;


            $("translateInput")
                .value =
                $("translateOutput")
                    .value;


            $("translateOutput")
                .value =
                input;

        };
}


/*
    IMPORTANT:
    Real multilingual translation requires
    a translation service/API.

    This function provides a small offline
    Hindi-English demo.
*/

const dictionaryENHI = {

    hello: "नमस्ते",

    hi: "नमस्ते",

    good: "अच्छा",

    morning: "सुबह",

    night: "रात",

    water: "पानी",

    food: "खाना",

    computer: "कंप्यूटर",

    college: "कॉलेज",

    student: "छात्र",

    teacher: "शिक्षक",

    book: "किताब",

    website: "वेबसाइट",

    developer: "डेवलपर",

    thank: "धन्यवाद",

    thanks: "धन्यवाद",

    yes: "हाँ",

    no: "नहीं",

    welcome: "स्वागत"

};


const dictionaryHIEN = {

    "नमस्ते": "hello",

    "अच्छा": "good",

    "सुबह": "morning",

    "रात": "night",

    "पानी": "water",

    "खाना": "food",

    "कंप्यूटर": "computer",

    "कॉलेज": "college",

    "छात्र": "student",

    "शिक्षक": "teacher",

    "किताब": "book",

    "वेबसाइट": "website",

    "डेवलपर": "developer",

    "धन्यवाद": "thank you",

    "हाँ": "yes",

    "नहीं": "no",

    "स्वागत": "welcome"

};


if ($("translateButton")) {

    $("translateButton").onclick =
        () => {

            const text =
                $("translateInput")
                    .value
                    .trim();


            if (!text) {

                showToast(
                    "Enter text first."
                );

                return;
            }


            const source =
                $("sourceLanguage")
                    .value;


            const target =
                $("targetLanguage")
                    .value;


            if (
                source === "en" &&
                target === "hi"
            ) {

                $("translateOutput")
                    .value =
                    text
                        .split(/\b/)
                        .map(word =>
                            dictionaryENHI[
                                word.toLowerCase()
                            ] || word
                        )
                        .join("");

            }

            else if (
                source === "hi" &&
                target === "en"
            ) {

                $("translateOutput")
                    .value =
                    text
                        .split(/\s+/)
                        .map(word =>
                            dictionaryHIEN[
                                word
                            ] || word
                        )
                        .join(" ");

            }

            else {

                $("translateOutput")
                    .value =
                    "For full multilingual translation, connect a translation API.";

            }

        };
}


/* =========================================================
   TEXT → SPEECH
========================================================= */

function loadVoices() {

    if (
        !("speechSynthesis" in window)
    ) return;


    state.voices =
        speechSynthesis.getVoices();


    const select =
        $("voiceSelect");


    if (!select) return;


    select.innerHTML = "";


    state.voices.forEach(
        (voice, index) => {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                index;


            option.textContent =
                `${voice.name} — ${voice.lang}`;


            select.appendChild(
                option
            );

        }
    );
}


if (
    "speechSynthesis"
    in window
) {

    speechSynthesis.onvoiceschanged =
        loadVoices;

    loadVoices();

}


if ($("speakText")) {

    $("speakText").onclick =
        () => {

            const text =
                $("speechInput")
                    .value
                    .trim();


            if (!text) {

                showToast(
                    "Enter text first."
                );

                return;
            }


            speechSynthesis.cancel();


            const utterance =
                new SpeechSynthesisUtterance(
                    text
                );


            const index =
                Number(
                    $("voiceSelect")
                        .value
                );


            if (
                state.voices[index]
            ) {

                utterance.voice =
                    state.voices[index];

            }


            utterance.rate =
                Number(
                    $("speechRate").value
                );


            speechSynthesis.speak(
                utterance
            );

        };
}


if ($("stopSpeech")) {

    $("stopSpeech").onclick =
        () => {

            speechSynthesis.cancel();

        };
}


/* =========================================================
   SPEECH → TEXT
========================================================= */

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (SpeechRecognition) {

    state.recognition =
        new SpeechRecognition();


    state.recognition.continuous =
        true;


    state.recognition.interimResults =
        true;


    state.recognition.lang =
        "en-IN";


    state.recognition.onresult =
        event => {

            let text = "";


            for (
                let i =
                    event.resultIndex;
                i < event.results.length;
                i++
            ) {

                text +=
                    event.results[i][0]
                        .transcript;

            }


            $("speechOutput")
                .value +=
                text;

        };


    state.recognition.onerror =
        event => {

            showToast(
                "Speech error: " +
                event.error
            );

        };

}


if ($("startSpeech")) {

    $("startSpeech").onclick =
        () => {

            if (!state.recognition) {

                showToast(
                    "Speech recognition is not supported in this browser."
                );

                return;
            }


            state.recognition.start();


            showToast(
                "🎤 Listening..."
            );

        };
}


if ($("stopRecognition")) {

    $("stopRecognition").onclick =
        () => {

            state.recognition?.stop();

        };
}


/* =========================================================
   JSON FORMATTER
========================================================= */

if ($("formatJson")) {

    $("formatJson").onclick =
        () => {

            try {

                const obj =
                    JSON.parse(
                        $("jsonInput").value
                    );


                $("jsonOutput")
                    .value =
                    JSON.stringify(
                        obj,
                        null,
                        4
                    );


                $("jsonStatus")
                    .textContent =
                    "✓ Valid JSON";


                $("jsonStatus")
                    .style.color =
                    "#16a34a";

            }

            catch (error) {

                $("jsonStatus")
                    .textContent =
                    "✕ Invalid JSON: " +
                    error.message;


                $("jsonStatus")
                    .style.color =
                    "#dc2626";

            }

        };
}


if ($("minifyJson")) {

    $("minifyJson").onclick =
        () => {

            try {

                const obj =
                    JSON.parse(
                        $("jsonInput").value
                    );


                $("jsonOutput")
                    .value =
                    JSON.stringify(
                        obj
                    );


                $("jsonStatus")
                    .textContent =
                    "✓ JSON minified";


            } catch {

                $("jsonStatus")
                    .textContent =
                    "✕ Invalid JSON";

            }

        };
}


if ($("validateJson")) {

    $("validateJson").onclick =
        () => {

            try {

                JSON.parse(
                    $("jsonInput").value
                );


                $("jsonStatus")
                    .textContent =
                    "✓ Valid JSON";


                $("jsonStatus")
                    .style.color =
                    "#16a34a";

            } catch {

                $("jsonStatus")
                    .textContent =
                    "✕ Invalid JSON";


                $("jsonStatus")
                    .style.color =
                    "#dc2626";

            }

        };
}


/* =========================================================
   BASE64
========================================================= */

function utf8ToBase64(text) {

    const bytes =
        new TextEncoder()
            .encode(text);


    let binary = "";


    bytes.forEach(byte => {

        binary += String.fromCharCode(
            byte
        );

    });


    return btoa(binary);
}


function base64ToUtf8(base64) {

    const binary =
        atob(base64);


    const bytes =
        Uint8Array.from(
            binary,
            char =>
                char.charCodeAt(0)
        );


    return new TextDecoder()
        .decode(bytes);
}


if ($("encodeBase64")) {

    $("encodeBase64").onclick =
        () => {

            try {

                $("base64Output")
                    .value =
                    utf8ToBase64(
                        $("base64Input")
                            .value
                    );

            } catch {

                showToast(
                    "Encoding failed."
                );

            }

        };
}


if ($("decodeBase64")) {

    $("decodeBase64").onclick =
        () => {

            try {

                $("base64Output")
                    .value =
                    base64ToUtf8(
                        $("base64Input")
                            .value
                            .trim()
                    );

            } catch {

                showToast(
                    "Invalid Base64."
                );

            }

        };
}


/* =========================================================
   URL ENCODER
========================================================= */

if ($("encodeUrl")) {

    $("encodeUrl").onclick =
        () => {

            $("urlOutput")
                .value =
                encodeURIComponent(
                    $("urlInput").value
                );

        };
}


if ($("decodeUrl")) {

    $("decodeUrl").onclick =
        () => {

            try {

                $("urlOutput")
                    .value =
                    decodeURIComponent(
                        $("urlInput").value
                    );

            } catch {

                showToast(
                    "Invalid URL encoding."
                );

            }

        };
}


/* =========================================================
   REGEX
========================================================= */

if ($("testRegex")) {

    $("testRegex").onclick =
        () => {

            try {

                const regex =
                    new RegExp(
                        $("regexPattern")
                            .value
                    );


                const text =
                    $("regexInput")
                        .value;


                const match =
                    regex.exec(text);


                if (match) {

                    $("regexStatus")
                        .textContent =
                        `✓ Match found: ${match[0]}`;


                    $("regexStatus")
                        .style.color =
                        "#16a34a";

                } else {

                    $("regexStatus")
                        .textContent =
                        "✕ No match";


                    $("regexStatus")
                        .style.color =
                        "#dc2626";

                }

            } catch (error) {

                $("regexStatus")
                    .textContent =
                    "✕ Invalid Regex";

                $("regexStatus")
                    .style.color =
                    "#dc2626";

            }

        };
}


/* =========================================================
   QR CODE
========================================================= */

if ($("generateQr")) {

    $("generateQr").onclick =
        () => {

            if (
                typeof QRCode ===
                "undefined"
            ) {

                showToast(
                    "QR library not loaded."
                );

                return;
            }


            const text =
                $("qrInput")
                    .value
                    .trim();


            if (!text) {

                showToast(
                    "Enter text or URL."
                );

                return;
            }


            $("qrPreview")
                .innerHTML = "";


            new QRCode(
                $("qrPreview"),
                {
                    text,
                    width: 220,
                    height: 220,
                    correctLevel:
                        QRCode.CorrectLevel.H
                }
            );

        };
}


/* =========================================================
   PASSWORD GENERATOR
========================================================= */

if ($("passwordLength")) {

    $("passwordLength")
        .addEventListener(
            "input",
            () => {

                $("passwordLengthOutput")
                    .textContent =
                    $("passwordLength")
                        .value;

            }
        );

}


if ($("generatePassword")) {

    $("generatePassword").onclick =
        () => {

            const length =
                Number(
                    $("passwordLength")
                        .value
                );


            let chars =
                "abcdefghijklmnopqrstuvwxyz";


            if (
                $("passwordUppercase")
                    .checked
            ) {

                chars +=
                    "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

            }


            if (
                $("passwordNumbers")
                    .checked
            ) {

                chars +=
                    "0123456789";

            }


            if (
                $("passwordSymbols")
                    .checked
            ) {

                chars +=
                    "!@#$%^&*()_+-=[]{}|;:,.<>?";

            }


            const values =
                new Uint32Array(
                    length
                );


            crypto.getRandomValues(
                values
            );


            let password = "";


            for (
                let i = 0;
                i < length;
                i++
            ) {

                password +=
                    chars[
                        values[i] %
                        chars.length
                    ];

            }


            $("generatedPassword")
                .value =
                password;

        };
}


/* =========================================================
   CALCULATOR
========================================================= */

let calculatorExpression = "";


document
    .querySelectorAll(
        "[data-calc]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const value =
                    button.dataset.calc;


                if (
                    value === "clear"
                ) {

                    calculatorExpression =
                        "";

                    $("calculatorDisplay")
                        .value =
                        "";

                    return;
                }


                if (
                    value === "backspace"
                ) {

                    calculatorExpression =
                        calculatorExpression
                            .slice(0, -1);

                    $("calculatorDisplay")
                        .value =
                        calculatorExpression;

                    return;
                }


                if (
                    value === "="
                ) {

                    try {

                        if (
                            !/^[0-9+\-*/().%\s]+$/
                                .test(
                                    calculatorExpression
                                )
                        ) {

                            throw new Error();

                        }


                        const result =
                            Function(
                                `"use strict"; return (${calculatorExpression})`
                            )();


                        calculatorExpression =
                            String(result);


                        $("calculatorDisplay")
                            .value =
                            calculatorExpression;

                    } catch {

                        $("calculatorDisplay")
                            .value =
                            "Error";

                        calculatorExpression =
                            "";

                    }

                    return;
                }


                calculatorExpression +=
                    value;


                $("calculatorDisplay")
                    .value =
                    calculatorExpression;

            }
        );

    });


/* =========================================================
   PERCENTAGE
========================================================= */

if ($("calculatePercentage")) {

    $("calculatePercentage").onclick =
        () => {

            const number =
                Number(
                    $("percentageNumber")
                        .value
                );


            const percent =
                Number(
                    $("percentageValue")
                        .value
                );


            if (
                !Number.isFinite(number) ||
                !Number.isFinite(percent)
            ) {

                showToast(
                    "Enter valid numbers."
                );

                return;
            }


            const result =
                number *
                percent /
                100;


            $("percentageResult")
                .textContent =
                `${percent}% of ${number} = ${result}`;

        };
}


/* =========================================================
   AGE CALCULATOR
========================================================= */

if ($("calculateAge")) {

    $("calculateAge").onclick =
        () => {

            const value =
                $("birthDate").value;


            if (!value) {

                showToast(
                    "Select date of birth."
                );

                return;
            }


            const birth =
                new Date(value);


            const today =
                new Date();


            let years =
                today.getFullYear() -
                birth.getFullYear();


            let months =
                today.getMonth() -
                birth.getMonth();


            let days =
                today.getDate() -
                birth.getDate();


            if (days < 0) {

                months--;

                const previousMonth =
                    new Date(
                        today.getFullYear(),
                        today.getMonth(),
                        0
                    );


                days +=
                    previousMonth
                        .getDate();

            }


            if (months < 0) {

                years--;

                months += 12;

            }


            $("ageResult")
                .textContent =
                `${years} Years, ${months} Months, ${days} Days`;

        };
}


/* =========================================================
   UNIT CONVERTER
========================================================= */

const conversionFactors = {

    km: 1000,

    m: 1,

    cm: 0.01,

    mile: 1609.344,

    ft: 0.3048

};


if ($("convertUnit")) {

    $("convertUnit").onclick =
        () => {

            const value =
                Number(
                    $("unitValue").value
                );


            const from =
                $("unitFrom").value;


            const to =
                $("unitTo").value;


            if (!Number.isFinite(value)) {

                showToast(
                    "Enter a valid value."
                );

                return;
            }


            const meters =
                value *
                conversionFactors[from];


            const result =
                meters /
                conversionFactors[to];


            $("unitResult")
                .textContent =
                `${value} ${from} = ${result} ${to}`;

        };
}


/* =========================================================
   DATE CALCULATOR
========================================================= */

if ($("calculateDate")) {

    $("calculateDate").onclick =
        () => {

            const start =
                new Date(
                    $("startDate").value
                );


            const end =
                new Date(
                    $("endDate").value
                );


            if (
                Number.isNaN(
                    start.getTime()
                ) ||
                Number.isNaN(
                    end.getTime()
                )
            ) {

                showToast(
                    "Select both dates."
                );

                return;
            }


            const difference =
                Math.abs(
                    end - start
                );


            const days =
                Math.round(
                    difference /
                    86400000
                );


            $("dateResult")
                .textContent =
                `${days} day(s)`;

        };
}


/* =========================================================
   STOPWATCH
========================================================= */

function updateStopwatch() {

    const hours =
        Math.floor(
            state.stopwatchSeconds /
            3600
        );


    const minutes =
        Math.floor(
            (
                state.stopwatchSeconds %
                3600
            ) / 60
        );


    const seconds =
        state.stopwatchSeconds %
        60;


    $("stopwatchDisplay")
        .textContent =
        [
            hours,
            minutes,
            seconds
        ]
        .map(
            n =>
                String(n)
                    .padStart(2, "0")
        )
        .join(":");

}


if ($("startStopwatch")) {

    $("startStopwatch").onclick =
        () => {

            if (
                state.stopwatchInterval
            ) return;


            state.stopwatchInterval =
                setInterval(
                    () => {

                        state.stopwatchSeconds++;

                        updateStopwatch();

                    },
                    1000
                );

        };
}


if ($("pauseStopwatch")) {

    $("pauseStopwatch").onclick =
        () => {

            clearInterval(
                state.stopwatchInterval
            );

            state.stopwatchInterval =
                null;

        };
}


if ($("resetStopwatch")) {

    $("resetStopwatch").onclick =
        () => {

            clearInterval(
                state.stopwatchInterval
            );

            state.stopwatchInterval =
                null;

            state.stopwatchSeconds =
                0;

            updateStopwatch();

        };
}


updateStopwatch();


/* =========================================================
   TIMER
========================================================= */

function updateTimer() {

    const minutes =
        Math.floor(
            state.timerSeconds / 60
        );


    const seconds =
        state.timerSeconds % 60;


    $("timerDisplay")
        .textContent =
        String(minutes)
            .padStart(2, "0") +
        ":" +
        String(seconds)
            .padStart(2, "0");

}


if ($("startTimer")) {

    $("startTimer").onclick =
        () => {

            if (
                state.timerInterval
            ) return;


            if (
                state.timerSeconds <= 0
            ) {

                state.timerSeconds =
                    Number(
                        $("timerMinutes")
                            .value
                    ) * 60 +
                    Number(
                        $("timerSeconds")
                            .value
                    );

            }


            if (
                state.timerSeconds <= 0
            ) {

                showToast(
                    "Set timer duration."
                );

                return;
            }


            state.timerInterval =
                setInterval(
                    () => {

                        state.timerSeconds--;

                        updateTimer();


                        if (
                            state.timerSeconds <= 0
                        ) {

                            clearInterval(
                                state.timerInterval
                            );

                            state.timerInterval =
                                null;

                            showToast(
                                "⏰ Timer finished!"
                            );

                        }

                    },
                    1000
                );

        };
}


if ($("pauseTimer")) {

    $("pauseTimer").onclick =
        () => {

            clearInterval(
                state.timerInterval
            );

            state.timerInterval =
                null;

        };
}


if ($("resetTimer")) {

    $("resetTimer").onclick =
        () => {

            clearInterval(
                state.timerInterval
            );

            state.timerInterval =
                null;


            state.timerSeconds =
                Number(
                    $("timerMinutes")
                        .value
                ) * 60 +
                Number(
                    $("timerSeconds")
                        .value
                );


            updateTimer();

        };
}


updateTimer();


/* =========================================================
   DASHBOARD STATISTICS
========================================================= */

function incrementStat(
    id,
    amount = 1
) {

    const element = $(id);

    if (!element) return;


    const current =
        Number(
            element.textContent
        ) || 0;


    element.textContent =
        current + amount;

}


function loadStats() {

    const pdf =
        Number(
            localStorage.getItem(
                "utilityPdfCount"
            )
        ) || 0;


    const images =
        Number(
            localStorage.getItem(
                "utilityImageCount"
            )
        ) || 0;


    const tools =
        Number(
            localStorage.getItem(
                "utilityToolCount"
            )
        ) || 0;


    if ($("pdfProcessed")) {

        $("pdfProcessed")
            .textContent =
            pdf;

    }


    if ($("imagesProcessed")) {

        $("imagesProcessed")
            .textContent =
            images;

    }


    if ($("toolsUsed")) {

        $("toolsUsed")
            .textContent =
            tools;

    }

}


function saveStat(
    name,
    value
) {

    localStorage.setItem(
        name,
        value
    );

}


function updateStoredStat(
    storageKey,
    amount
) {

    const old =
        Number(
            localStorage.getItem(
                storageKey
            )
        ) || 0;


    saveStat(
        storageKey,
        old + amount
    );

}


function trackTool() {

    updateStoredStat(
        "utilityToolCount",
        1
    );

}


const originalOpenTool =
    openTool;


loadStats();


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.ctrlKey &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();

            $("toolSearch")
                ?.focus();

        }

    }
);


/* =========================================================
   INITIAL MESSAGE
========================================================= */

console.log(
    "Personal Utility Studio loaded successfully."
);

console.log(
    "PDF.js:",
    pdfjsReady
);

console.log(
    "PDF-Lib:",
    !!window.PDFLib
);

console.log(
    "jsPDF:",
    !!window.jspdf
);

console.log(
    "QRCode:",
    typeof QRCode !== "undefined"
);


/* =========================================================
   END
========================================================= */
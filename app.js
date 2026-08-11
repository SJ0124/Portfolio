document.addEventListener("DOMContentLoaded", () => {
    /* =====================================================
       B1 — Project data + dynamic DOM rendering
       ===================================================== */
    const projects = [
        {
            id: 1,
            title: "Silent Alarm Band with IoT Integration",
            category: "IoT",
            description:
                "A wearable IoT-based silent alarm system using ESP8266 and MAX30102 sensors. It combines vibration alerts, cloud alarm scheduling, activity logging and real-time heart-rate and SpO₂ monitoring.",
            technologies: ["ESP8266", "AWS IoT", "ThingSpeak", "MAX30102"],
            visual: "visual-iot",
            code: "sensor.read();\\nalert.vibrate();\\ncloud.sync();"
        },
        {
            id: 2,
            title: "Eye-Tracking Reading Assistant",
            category: "Web",
            description:
                "An accessibility-focused web application using webcam-based eye tracking and iris detection, with gaze calibration and personalized reading preferences.",
            technologies: ["HTML", "CSS", "JavaScript", "MediaPipe"],
            visual: "visual-web",
            code: "gaze.track();\\nreader.focus();\\naccessibility.on();"
        },
        {
            id: 3,
            title: "Group Chat Application",
            category: "Java",
            description:
                "A Java-based group chat application for communication and collaboration, using SQL for database management and client-server communication.",
            technologies: ["Java", "SQL", "OOP", "Client-Server"],
            visual: "visual-java",
            code: "server.start();\\nmessage.send();\\ndatabase.save();"
        }
    ];

    const grid = document.querySelector("#projects-grid");
    const count = document.querySelector("#project-count");

    const renderProjects = (items) => {
        grid.innerHTML = items.map(({
            id, title, category, description, technologies, visual, code
        }) => `
            <article class="project-card">
                <div class="project-visual ${visual}">
                    <pre class="visual-code">${code}</pre>
                    <span class="visual-label">${category}</span>
                </div>
                <div class="project-content">
                    <p class="project-no">PROJECT ${String(id).padStart(2, "0")}</p>
                    <h3>${title}</h3>
                    <p>${description}</p>
                    <ul class="tags">
                        ${technologies.map(tech => `<li>${tech}</li>`).join("")}
                    </ul>
                    <button class="details-button" type="button" data-id="${id}">
                        View project details →
                    </button>
                </div>
            </article>
        `).join("");

        count.textContent = `${items.length} project${items.length === 1 ? "" : "s"} shown`;

        document.querySelectorAll(".details-button").forEach(button => {
            button.addEventListener("click", () => {
                const id = Number(button.dataset.id);
                const project = projects.find(item => item.id === id);
                if (!project) return;

                const { title, category, description, technologies } = project;

                document.querySelector("#modal-content").innerHTML = `
                    <div class="modal-inner">
                        <p class="kicker">${category} / PROJECT ${String(id).padStart(2, "0")}</p>
                        <h2>${title}</h2>
                        <p>${description}</p>
                        <ul class="tags">
                            ${technologies.map(tech => `<li>${tech}</li>`).join("")}
                        </ul>
                        <a class="button button-dark" href="#contact" id="modal-contact">
                            Ask me about this project ↗
                        </a>
                    </div>
                `;

                document.querySelector("#project-modal").showModal();
                document.querySelector("#modal-contact")?.addEventListener(
                    "click",
                    () => document.querySelector("#project-modal").close()
                );
            });
        });
    };

    renderProjects(projects);

    /* =====================================================
       B2 — Project filter
       ===================================================== */
    document.querySelectorAll(".filter").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset.filter;
            const visibleProjects = filter === "all"
                ? projects
                : projects.filter(project => project.category === filter);

            renderProjects(visibleProjects);
        });
    });

    /* =====================================================
       B2 — Project modal
       ===================================================== */
    const modal = document.querySelector("#project-modal");
    document.querySelector("#modal-close").addEventListener("click", () => modal.close());

    modal.addEventListener("click", event => {
        const box = modal.getBoundingClientRect();
        const outside =
            event.clientX < box.left ||
            event.clientX > box.right ||
            event.clientY < box.top ||
            event.clientY > box.bottom;

        if (outside) modal.close();
    });

    /* =====================================================
       B2 — Mobile navigation
       ===================================================== */
    const menuToggle = document.querySelector("#menu-toggle");
    const navMenu = document.querySelector("#nav-menu");

    menuToggle.addEventListener("click", () => {
        const open = navMenu.classList.toggle("open");
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    /* =====================================================
       B2 + B4 — Theme switch persisted with localStorage
       ===================================================== */
    const themeToggle = document.querySelector("#theme-toggle");
    const themeSymbol = document.querySelector("#theme-symbol");
    const savedTheme = localStorage.getItem("portfolio-theme") || "light";

    const applyTheme = theme => {
        const dark = theme === "dark";
        document.body.classList.toggle("dark", dark);
        themeSymbol.textContent = dark ? "☀" : "☾";
        themeToggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    };

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", () => {
        const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
        localStorage.setItem("portfolio-theme", nextTheme);
        applyTheme(nextTheme);
    });

    /* =====================================================
       B3 — Contact form + regex validation
       ===================================================== */
    const form = document.querySelector("#contact-form");

    const fields = {
        name: {
            input: document.querySelector("#contact-name"),
            message: document.querySelector("#name-message"),
            regex: /^[A-Za-z][A-Za-z\s.'-]{1,49}$/,
            error: "Please enter a valid name."
        },
        email: {
            input: document.querySelector("#contact-email"),
            message: document.querySelector("#email-message"),
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
            error: "Please enter a valid email address."
        },
        message: {
            input: document.querySelector("#contact-message"),
            message: document.querySelector("#message-message"),
            regex: /^[\s\S]{10,1000}$/,
            error: "Message must be between 10 and 1000 characters."
        }
    };

    const validate = field => {
        const value = field.input.value.trim();

        if (!field.regex.test(value)) {
            field.input.classList.add("invalid");
            field.input.classList.remove("valid");
            field.message.textContent = field.error;
            field.message.classList.remove("success");
            return false;
        }

        field.input.classList.remove("invalid");
        field.input.classList.add("valid");
        field.message.textContent = "Looks good.";
        field.message.classList.add("success");
        return true;
    };

    Object.values(fields).forEach(field => {
        field.input.addEventListener("input", () => validate(field));
    });

    form.addEventListener("submit", event => {
        event.preventDefault();

        const valid = Object.values(fields).map(validate).every(Boolean);
        const status = document.querySelector("#form-status");

        if (!valid) {
            status.textContent = "Please fix the highlighted fields.";
            status.className = "form-status error";
            return;
        }

        const { value: name } = fields.name.input;
        status.textContent = `Thanks, ${name.trim()}! Your message passed validation successfully.`;
        status.className = "form-status success";

        form.reset();
        Object.values(fields).forEach(({ input, message }) => {
            input.classList.remove("valid", "invalid");
            message.textContent = "";
            message.classList.remove("success");
        });
    });
});

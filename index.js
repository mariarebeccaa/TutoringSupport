// Selectăm linkurile din sidebar
const menuLinks = document.querySelectorAll(".sidebar a");
const sections = document.querySelectorAll(".section");

menuLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();

        // scoatem clasa 'active' de la toate linkurile și secțiunile
        menuLinks.forEach(l => l.classList.remove("active"));
        sections.forEach(s => s.classList.remove("active"));

        // adăugăm 'active' pe linkul apăsat
        link.classList.add("active");

        // găsim secțiunea asociată (folosim atributul data-section)
        const sectionId = link.getAttribute("data-section");
        document.getElementById(sectionId).classList.add("active");

        // Închide sidebar-ul dacă este deschis (indiferent de ecran)
        if (sidebar.classList.contains("open")) {
            sidebar.classList.remove("open");
        }
    });
});

// Array cu groups (încarcă din localStorage sau folosește default)
const STORAGE_KEY = 'cot_groups_v1';
let groups = JSON.parse(localStorage.getItem(STORAGE_KEY));
if (!Array.isArray(groups)) {
    groups = [
        {
            id: 1,
            name: "Math - 7th Grade",
            desc: "Tuesday, 4:00 PM",
            students: "5 students",
            img: "assets/logo_mate.jpg"
        },
        {
            id: 2,
            name: "English - 10th Grade",
            desc: "Thursday, 6:00 PM",
            students: "8 students",
            img: "assets/logo_eng.jpg"
        },
        {
            id: 3,
            name: "Physics - 9th Grade",
            desc: "Friday, 5:30 PM",
            students: "6 students",
            img: "assets/logo_fizica.jpg"
        }
    ];
}

function saveGroups() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
    } catch (err) {
        console.warn('Failed to save groups to localStorage', err);
    }
}

const groupsContainer = document.querySelector(".groups");

function closeAllMenus() {
    document.querySelectorAll('.options-menu').forEach(m => m.style.display = 'none');
    document.querySelectorAll('.options-btn').forEach(b => b.setAttribute('aria-expanded', 'false'));
}

// închidem meniurile când se apasă în afară
document.addEventListener('click', () => closeAllMenus());

function renderGroups() {
    const groupsContainer = document.querySelector(".groups");
    if (!groupsContainer) return;
    groupsContainer.innerHTML = "";

    groups.forEach(group => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-image">
                <img src="${group.img}" alt="${group.name}" />
            </div>
            <h3>${group.name}</h3>
            <p>${group.desc}</p>
            <p>${group.students}</p>

            <!-- OPEN button: left-bottom -->
            <button class="open-btn btn-primary" data-id="${group.id}" aria-label="Open group">Open</button>

            <div class="card-actions">
                <button class="icon-btn edit-btn" aria-label="Edit group" data-id="${group.id}">
                    <!-- pencil SVG -->
                    <svg viewBox="0 0 24 24" aria-hidden><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="icon-btn delete-btn" aria-label="Delete group" data-id="${group.id}">
                    <!-- trash SVG -->
                    <svg viewBox="0 0 24 24" aria-hidden><path d="M3 6h18M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
            </div>
        `;

        groupsContainer.appendChild(card);

        const openBtn = card.querySelector('.open-btn');
        const editBtn = card.querySelector('.edit-btn');
        const deleteBtn = card.querySelector('.delete-btn');

        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openGroup(group.id);
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEdit(group.id);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteGroup(group.id);
        });
    });
}

renderGroups();

const menuToggle = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".sidebar");

const mainContainer = document.querySelector('.main');
const navBar = document.querySelector('.navbar');

if (menuToggle && sidebar && mainContainer && navBar) {
    menuToggle.addEventListener("click", () => {
        // use matchMedia instead of window.innerWidth to avoid false 'desktop' branch
        if (window.matchMedia('(min-width: 601px)').matches) {
            sidebar.classList.toggle("closed");
            mainContainer.classList.toggle("shifted");
            navBar.classList.toggle("shifted");
        } else {
            sidebar.classList.toggle("open");
        }
    });
}


// Modal logic pentru Add Group (actualizat pentru blur + close-on-backdrop)
const addGroupBtn = document.getElementById("addGroupBtn");
const addGroupModal = document.getElementById("addGroupModal");
const closeModal = document.getElementById("closeModal");
const addGroupForm = document.getElementById("addGroupForm");
const submitBtn = addGroupForm.querySelector('button[type="submit"]');

function openAddModal() {
    addGroupForm.reset();
    addGroupModal.removeAttribute('data-edit-id');
    submitBtn.textContent = 'Add';
    addGroupModal.style.display = "flex";
    document.body.classList.add("modal-open");
}

function openEdit(id) {
    const group = groups.find(g => g.id === id);
    if (!group) return;
    document.getElementById("groupName").value = group.name;
    document.getElementById("groupDesc").value = group.desc;
    document.getElementById("groupStudents").value = group.students;
    document.getElementById("groupImg").value = group.img;
    addGroupModal.dataset.editId = id;
    submitBtn.textContent = 'Save';
    addGroupModal.style.display = "flex";
    document.body.classList.add("modal-open");
}

function deleteGroup(id) {
    if (!confirm('Are you sure you want to delete this group?')) return;
    groups = groups.filter(g => g.id !== id);
    saveGroups();
    renderGroups();
}

if (addGroupBtn && addGroupModal && closeModal && addGroupForm) {
    addGroupBtn.addEventListener("click", openAddModal);

    closeModal.addEventListener("click", () => {
        addGroupModal.style.display = "none";
        document.body.classList.remove("modal-open");
        addGroupModal.removeAttribute('data-edit-id');
    });

    addGroupModal.addEventListener("click", (e) => {
        if (e.target === addGroupModal) {
            addGroupModal.style.display = "none";
            document.body.classList.remove("modal-open");
            addGroupModal.removeAttribute('data-edit-id');
        }
    });

    addGroupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("groupName").value.trim();
        const desc = document.getElementById("groupDesc").value.trim();
        const students = document.getElementById("groupStudents").value.trim();
        const img = document.getElementById("groupImg").value.trim() || 'assets/logo_mate.jpg';

        const editId = addGroupModal.dataset.editId;

        if (editId) {
            // update existing
            const idx = groups.findIndex(g => g.id === Number(editId));
            if (idx > -1) {
                groups[idx] = {
                    ...groups[idx],
                    name,
                    desc,
                    students,
                    img
                };
            }
        } else {
            // new group
            const newGroup = {
                id: (groups.length ? Math.max(...groups.map(g => g.id)) : 0) + 1,
                name,
                desc,
                students,
                img
            };
            groups.push(newGroup);
        }

        saveGroups();           // <-- salvează persistent
        renderGroups();
        addGroupModal.style.display = "none";
        document.body.classList.remove("modal-open");
        addGroupForm.reset();
        addGroupModal.removeAttribute('data-edit-id');
        submitBtn.textContent = 'Add';
    });
}

// Participants: array + localStorage
const PART_KEY = 'cot_participants_v1';
let participants = JSON.parse(localStorage.getItem(PART_KEY));
if (!Array.isArray(participants)) {
    participants = [
        { id: 1, first: 'Bernd', last: 'Pfefferberg', email: 'user.test@codeoftalent.com', class: '7A', subjects: ['Math'], status: 'Active', invited: true },
        { id: 2, first: 'Gaspar', last: 'Antunes', email: 'user.test@codeoftalent.com', class: '10B', subjects: ['English'], status: 'Inactive', invited: false }
    ];
}
function saveParticipants() {
    try { localStorage.setItem(PART_KEY, JSON.stringify(participants)); }
    catch (e) { console.warn('Failed to save participants', e); }
}

const participantsBody = document.getElementById('participantsBody');

// render participants table
function renderParticipants() {
    if (!participantsBody) return;
    participantsBody.innerHTML = '';

    participants.forEach(p => {
        const tr = document.createElement('tr');
        const subjectsHtml = (p.subjects || []).map(s => `<span class="sub-badge">${escapeHtml(s)}</span>`).join(' ');
        const fullname = `${escapeHtml(p.first)} ${escapeHtml(p.last)}`;

        tr.innerHTML = `
            <td><input type="checkbox" data-id="${p.id}"></td>
            <td class="p-name"><div class="p-avatar">${getInitials(p.first, p.last)}</div><div class="p-info"><div class="p-full">${fullname}</div></div></td>
            <td>${escapeHtml(p.email || '')}</td>
            <td>${escapeHtml(p.class || '')}</td>
            <td>${subjectsHtml}</td>
            <td><button class="status-btn ${p.status === 'Active' ? 'active' : 'inactive'}" data-id="${p.id}">${p.status}</button></td>
            <td><button class="invite-btn ${p.invited ? 'active' : 'inactive'}" data-id="${p.id}" data-invited="${p.invited}">${p.invited ? 'Invited' : 'Invite'}</button></td>
            <td class="actions-td">
                <button class="icon-btn table-icon edit-btn" aria-label="Edit participant" data-id="${p.id}">
                    <svg viewBox="0 0 24 24" aria-hidden><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                </button>
                <button class="icon-btn table-icon delete-btn" aria-label="Delete participant" data-id="${p.id}">
                    <svg viewBox="0 0 24 24" aria-hidden><path d="M3 6h18M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
                </button>
            </td>
        `;

        participantsBody.appendChild(tr);

        // handlers
        const inviteBtn = tr.querySelector('.invite-btn');
        const statusBtn = tr.querySelector('.status-btn');
        const editBtn = tr.querySelector('.edit-btn');
        const deleteBtn = tr.querySelector('.delete-btn');

        inviteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleInvite(p.id);
        });

        statusBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleStatus(p.id);
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditParticipant(p.id);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteParticipant(p.id);
        });
    });
}

// helpers
function getInitials(first, last) {
    return ((first || '')[0] || '') + ((last || '')[0] || '');
}
function escapeHtml(s) { return (s + '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

// actions
function toggleInvite(id) {
    const idx = participants.findIndex(x => x.id === id);
    if (idx === -1) return;
    participants[idx].invited = !participants[idx].invited;
    saveParticipants();
    renderParticipants();
}

function deleteParticipant(id) {
    if (!confirm('Delete participant?')) return;
    participants = participants.filter(p => p.id !== id);
    saveParticipants();
    renderParticipants();
}

function openEditParticipant(id) {
    const p = participants.find(x => x.id === id);
    if (!p) return;
    document.getElementById('pFirst').value = p.first;
    document.getElementById('pLast').value = p.last;
    document.getElementById('pEmail').value = p.email || '';
    document.getElementById('pClass').value = p.class || '';
    document.getElementById('pSubjects').value = (p.subjects || []).join(', ');
    participantModal.dataset.editId = id;
    document.getElementById('participantModalTitle').textContent = 'Edit participant';
    document.getElementById('participantSubmit').textContent = 'Save';
    participantModal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

function openAddParticipant() {
    document.getElementById('participantForm').reset();
    participantModal.removeAttribute('data-edit-id');
    document.getElementById('participantModalTitle').textContent = 'Add participant';
    document.getElementById('participantSubmit').textContent = 'Add';
    participantModal.style.display = 'flex';
    document.body.classList.add('modal-open');
}

// wire modal elements
const addParticipantBtn = document.getElementById('addParticipantBtn');
const participantModal = document.getElementById('participantModal');
const closeParticipantModal = document.getElementById('closeParticipantModal');
const participantForm = document.getElementById('participantForm');

if (addParticipantBtn && participantModal && closeParticipantModal && participantForm) {
    addParticipantBtn.addEventListener('click', openAddParticipant);
    closeParticipantModal.addEventListener('click', () => {
        participantModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        participantModal.removeAttribute('data-edit-id');
    });
    participantModal.addEventListener('click', (e) => {
        if (e.target === participantModal) {
            participantModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            participantModal.removeAttribute('data-edit-id');
        }
    });
    participantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const first = document.getElementById('pFirst').value.trim();
        const last = document.getElementById('pLast').value.trim();
        const email = document.getElementById('pEmail').value.trim();
        const cls = document.getElementById('pClass').value.trim();
        const subs = document.getElementById('pSubjects').value.split(',').map(s => s.trim()).filter(Boolean);
        const editId = participantModal.dataset.editId;
        if (editId) {
            const idx = participants.findIndex(x => x.id === Number(editId));
            if (idx > -1) {
                participants[idx] = { ...participants[idx], first, last, email, class: cls, subjects: subs };
            }
        } else {
            const newP = {
                id: (participants.length ? Math.max(...participants.map(p => p.id)) : 0) + 1,
                first, last, email, class: cls, subjects: subs, status: 'Active', invited: false
            };
            participants.push(newP);
        }
        saveParticipants();
        renderParticipants();
        participantModal.style.display = 'none';
        document.body.classList.remove('modal-open');
        participantModal.removeAttribute('data-edit-id');
        participantForm.reset();
    });
}

// toggle status (Active <-> Inactive)
function toggleStatus(id) {
    const idx = participants.findIndex(x => x.id === id);
    if (idx === -1) return;
    participants[idx].status = participants[idx].status === 'Active' ? 'Inactive' : 'Active';
    saveParticipants();
    renderParticipants();
}

// initial render
renderParticipants();

function openGroup(id) {
    const g = groups.find(x => x.id === id);
    if (!g) return;
    // placeholder behaviour — poți deschide modal/redirect după nevoie
    alert('Open group: ' + g.name);
}

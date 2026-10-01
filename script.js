// ==========================================================================
// SAMARTH BUSINESS PLATFORM (SIH26092) - MAIN APPLICATION LOGIC WITH BANK DPR
// ==========================================================================

document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. TOAST NOTIFICATION UTILITY
    // ==========================================
    function showToast(message, icon = "fa-circle-check") {
        const container = document.getElementById("toast-container");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(100%)";
            toast.style.transition = "all 0.3s ease";
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Number formatting in Indian currency style (e.g. ₹5,00,000)
    function formatINR(number) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(number);
    }


    // ==========================================
    // 2. PROFILE SAVE & LOAD (ID-BASED)
    // ==========================================
    const profileForm = document.getElementById("profile-form");
    const fields = {
        name: document.getElementById("prof-name"),
        contact: document.getElementById("prof-contact"),
        stage: document.getElementById("prof-stage"),
        category: document.getElementById("prof-category"),
        interest: document.getElementById("prof-interest"),
        savings: document.getElementById("prof-savings"),
        income: document.getElementById("prof-income"),
        location: document.getElementById("prof-location")
    };

    // Load saved data
    const savedData = localStorage.getItem("samarth_user_profile");
    if (savedData) {
        try {
            const p = JSON.parse(savedData);
            if (fields.name && p.name) fields.name.value = p.name;
            if (fields.contact && p.contact) fields.contact.value = p.contact;
            if (fields.stage && p.stage) fields.stage.value = p.stage;
            if (fields.category && p.category) fields.category.value = p.category;
            if (fields.interest && p.interest) fields.interest.value = p.interest;
            if (fields.savings && p.savings) fields.savings.value = p.savings;
            if (fields.income && p.income) fields.income.value = p.income;
            if (fields.location && p.location) fields.location.value = p.location;
        } catch (e) {
            console.error("Error loading saved profile:", e);
        }
    }

    if (profileForm) {
        profileForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const profileData = {
                name: fields.name?.value || "",
                contact: fields.contact?.value || "",
                stage: fields.stage?.value || "",
                category: fields.category?.value || "",
                interest: fields.interest?.value || "",
                savings: fields.savings?.value || "",
                income: fields.income?.value || "",
                location: fields.location?.value || ""
            };

            localStorage.setItem("samarth_user_profile", JSON.stringify(profileData));
            showToast("Profile saved & matched with government schemes!");

            // Sync with fund planner
            if (fields.savings?.value) {
                const savingsRange = document.getElementById("savings-range");
                if (savingsRange) {
                    savingsRange.value = fields.savings.value;
                    updateFundPlanner();
                }
            }
        });
    }


    // ==========================================
    // 3. GOVERNMENT SCHEMES ENGINE & FILTERS
    // ==========================================
    const schemesData = [
        {
            id: 1,
            title: "PMEGP (Prime Minister Employment Generation Programme)",
            category: "subsidy",
            categoryName: "15% - 35% Govt Subsidy",
            badgeClass: "pill-indigo",
            ministry: "Ministry of MSME, Govt. of India",
            desc: "Credit-linked subsidy programme to generate employment opportunities by establishing micro-enterprises in manufacturing and service sectors.",
            maxLoan: "₹50 Lakhs (Mfg) / ₹20L (Service)",
            subsidy: "15% to 35% Margin Money Subsidy",
            link: "https://kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"
        },
        {
            id: 2,
            title: "Pradhan Mantri Mudra Yojana (PMMY)",
            category: "loan",
            categoryName: "Collateral-Free Loan",
            badgeClass: "pill-success",
            ministry: "Department of Financial Services",
            desc: "Institutional credit up to ₹10 Lakhs for non-corporate, non-farm small/micro enterprises without requiring collateral or third-party guarantee.",
            maxLoan: "Up to ₹10,00,000",
            subsidy: "Collateral Free (Zero Security)",
            link: "https://www.mudra.org.in/"
        },
        {
            id: 3,
            title: "PM SVANidhi (Street Vendor's AtmaNirbhar Nidhi)",
            category: "micro",
            categoryName: "Micro Retail & Street Vendors",
            badgeClass: "pill-indigo",
            ministry: "Ministry of Housing & Urban Affairs",
            desc: "Collateral-free working capital loan for street vendors and micro retailers to resume and expand business with 7% interest subsidy.",
            maxLoan: "₹10,000 to ₹50,000 (3 Tranches)",
            subsidy: "7% Interest Subsidy Rebate",
            link: "https://pmsvanidhi.mohua.gov.in/"
        },
        {
            id: 4,
            title: "Stand-Up India Scheme",
            category: "loan",
            categoryName: "Women & SC/ST Focus",
            badgeClass: "pill-success",
            ministry: "SIDBI / Ministry of Finance",
            desc: "Facilitates bank loans between ₹10 Lakh and ₹1 Crore to at least one SC/ST borrower and at least one woman borrower per bank branch.",
            maxLoan: "₹10 Lakh to ₹1 Crore",
            subsidy: "Concessional Interest Rates",
            link: "https://www.standupmitra.in/"
        },
        {
            id: 5,
            title: "PM Vishwakarma Scheme",
            category: "subsidy",
            categoryName: "Artisans & Craftsmen",
            badgeClass: "pill-indigo",
            ministry: "Ministry of Skill Development & MSME",
            desc: "End-to-end support for traditional artisans including certified skill training, ₹15,000 modern toolkit incentive, and collateral-free loans at 5% rate.",
            maxLoan: "Up to ₹3,00,000 (at 5% Interest)",
            subsidy: "₹15,000 Toolkit + Training Stipend",
            link: "https://pmvishwakarma.gov.in/"
        },
        {
            id: 6,
            title: "CGTMSE Credit Guarantee Scheme",
            category: "loan",
            categoryName: "Bank Guarantee Support",
            badgeClass: "pill-success",
            ministry: "Ministry of MSME & SIDBI",
            desc: "Guarantees credit facilities up to ₹5 Crore to micro and small enterprises without the need for collateral security or third-party guarantee.",
            maxLoan: "Up to ₹5,00,00,000",
            subsidy: "Up to 85% Govt Guarantee Cover",
            link: "https://www.cgtmse.in/"
        }
    ];

    const schemeContainer = document.getElementById("scheme-list-container");

    function renderSchemes(filter = "all") {
        if (!schemeContainer) return;
        schemeContainer.innerHTML = "";

        const filtered = filter === "all"
            ? schemesData
            : schemesData.filter(s => s.category === filter);

        filtered.forEach(scheme => {
            const card = document.createElement("div");
            card.className = "scheme-card";
            card.innerHTML = `
                <div class="scheme-card-top">
                    <span class="badge-pill ${scheme.badgeClass}">${scheme.categoryName}</span>
                    <i class="fa-solid fa-landmark" style="color: var(--primary); font-size: 1.2rem;"></i>
                </div>
                <h3>${scheme.title}</h3>
                <span class="scheme-ministry"><i class="fa-solid fa-shield"></i> ${scheme.ministry}</span>
                <p>${scheme.desc}</p>
                <div class="scheme-metrics">
                    <div class="scheme-metric-item">
                        <span>Max Assistance</span>
                        <strong>${scheme.maxLoan}</strong>
                    </div>
                    <div class="scheme-metric-item">
                        <span>Key Benefit</span>
                        <strong style="color: var(--emerald);">${scheme.subsidy}</strong>
                    </div>
                </div>
                <a href="${scheme.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary scheme-btn">
                    <span>View Official Portal</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            `;
            schemeContainer.appendChild(card);
        });
    }

    renderSchemes("all");

    // Filter Button Clicks
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            filterButtons.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            renderSchemes(this.getAttribute("data-filter"));
        });
    });


    // ==========================================
    // 4. DYNAMIC FUND PLANNER
    // ==========================================
    const loanRange = document.getElementById("loan-range");
    const savingsRange = document.getElementById("savings-range");
    const displayLoan = document.getElementById("display-loan-amount");
    const displaySavings = document.getElementById("display-savings-amount");
    const totalFundValue = document.getElementById("total-fund-value");
    const allocationContainer = document.getElementById("allocation-items");

    const allocationConfig = [
        { name: "Equipment & Machinery", purpose: "Core tools, processing hardware, and production apparatus", pct: 0.32, color: "#2563eb", icon: "fa-gears" },
        { name: "Initial Stock & Inventory", purpose: "Fast-moving commercial goods and raw material reserve", pct: 0.24, color: "#059669", icon: "fa-boxes-packing" },
        { name: "3-Month Operating Capital", purpose: "Operational buffer for rent, utility bills, and logistics", pct: 0.16, color: "#7c3aed", icon: "fa-coins" },
        { name: "Store Interior & Counter Setup", purpose: "Commercial fit-out, display fixtures, and billing POS", pct: 0.13, color: "#d97706", icon: "fa-shop" },
        { name: "Emergency Contingency Reserve", purpose: "Liquidity safeguard required under RBI prudential guidelines", pct: 0.10, color: "#0891b2", icon: "fa-shield-heart" },
        { name: "Local Marketing & Signage", purpose: "Shopfront signboard, promotional flyers, and digital marketing", pct: 0.05, color: "#db2777", icon: "fa-bullhorn" }
    ];

    function updateFundPlanner() {
        if (!loanRange || !savingsRange) return;

        const loan = parseFloat(loanRange.value) || 0;
        const savings = parseFloat(savingsRange.value) || 0;
        const total = loan + savings;

        if (displayLoan) displayLoan.textContent = formatINR(loan);
        if (displaySavings) displaySavings.textContent = formatINR(savings);
        if (totalFundValue) totalFundValue.textContent = formatINR(total);

        if (allocationContainer) {
            allocationContainer.innerHTML = "";
            allocationConfig.forEach(item => {
                const itemAmount = total * item.pct;
                const row = document.createElement("div");
                row.className = "alloc-item";
                row.innerHTML = `
                    <div class="alloc-info">
                        <span class="alloc-title">
                            <i class="fa-solid ${item.icon}" style="color: ${item.color};"></i>
                            ${item.name} (${Math.round(item.pct * 100)}%)
                        </span>
                        <span class="alloc-amount">${formatINR(itemAmount)}</span>
                    </div>
                    <div class="alloc-bar-track">
                        <div class="alloc-bar-fill" style="width: ${Math.round(item.pct * 100)}%; background-color: ${item.color};"></div>
                    </div>
                `;
                allocationContainer.appendChild(row);
            });
        }
    }

    if (loanRange && savingsRange) {
        loanRange.addEventListener("input", updateFundPlanner);
        savingsRange.addEventListener("input", updateFundPlanner);
        updateFundPlanner();
    }


    // ==========================================
    // 5. OFFICIAL BANK DPR (PROJECT REPORT) GENERATOR
    // ==========================================
    const openDprModalBtn = document.getElementById("open-dpr-modal-btn");
    const headerDprBtn = document.getElementById("header-dpr-btn");
    const dprModalOverlay = document.getElementById("dpr-modal-overlay");
    const dprCloseBtn = document.getElementById("dpr-close-btn");
    const dprPrintBtn = document.getElementById("dpr-print-btn");

    function generateBankDPR() {
        // Read Profile Data
        const name = fields.name?.value.trim() || "Ramesh Kumar";
        const contact = fields.contact?.value.trim() || "9876543210";
        const stage = fields.stage?.value || "New Business (Startup)";
        const category = fields.category?.value || "General MSME";
        const sector = fields.interest?.value.trim() || "Retail & Consumer Goods Trade";
        const location = fields.location?.value.trim() || "India (State MSME Cluster)";

        // Read Financial Data
        const loan = parseFloat(loanRange?.value) || 500000;
        const savings = parseFloat(savingsRange?.value) || 150000;
        const total = loan + savings;

        const savingsPct = ((savings / total) * 100).toFixed(2);
        const loanPct = ((loan / total) * 100).toFixed(2);
        const der = savings > 0 ? (loan / savings).toFixed(2) : "N/A";

        // Populate Promoter Section
        document.getElementById("dpr-promoter-name").textContent = name;
        document.getElementById("dpr-promoter-contact").textContent = contact;
        document.getElementById("dpr-promoter-stage").textContent = stage;
        document.getElementById("dpr-promoter-category").textContent = category;
        document.getElementById("dpr-promoter-sector").textContent = sector;
        document.getElementById("dpr-promoter-location").textContent = location;

        // Populate Financial Section
        document.getElementById("dpr-val-savings").textContent = formatINR(savings);
        document.getElementById("dpr-pct-savings").textContent = `${savingsPct}%`;
        document.getElementById("dpr-val-loan").textContent = formatINR(loan);
        document.getElementById("dpr-pct-loan").textContent = `${loanPct}%`;
        document.getElementById("dpr-val-total").textContent = formatINR(total);
        document.getElementById("dpr-der-ratio").textContent = `${der} : 1`;

        // Populate Allocation Table
        const tbody = document.getElementById("dpr-allocation-tbody");
        if (tbody) {
            tbody.innerHTML = "";
            allocationConfig.forEach(item => {
                const itemAmount = total * item.pct;
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td><strong>${item.name}</strong></td>
                    <td>${item.purpose}</td>
                    <td>${Math.round(item.pct * 100)}%</td>
                    <td><strong>${formatINR(itemAmount)}</strong></td>
                `;
                tbody.appendChild(tr);
            });
        }

        // Scheme Linkage Recommendation
        const dprSchemeName = document.getElementById("dpr-scheme-name");
        const dprSchemeSubsidy = document.getElementById("dpr-scheme-subsidy");

        if (loan <= 1000000) {
            dprSchemeName.textContent = "Pradhan Mantri Mudra Yojana (PMMY - Tarun Category)";
            dprSchemeSubsidy.textContent = "Collateral-Free Credit Facility with Mudra Card Limit";
        } else {
            dprSchemeName.textContent = "Prime Minister Employment Generation Programme (PMEGP)";
            dprSchemeSubsidy.textContent = category.includes("SC") || category.includes("Women") || category.includes("OBC")
                ? "25% - 35% Govt Margin Money Capital Subsidy"
                : "15% - 25% Govt Margin Money Capital Subsidy";
        }

        // Metadata
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const refNo = `SIH-DPR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

        document.getElementById("dpr-date").textContent = `Date: ${dateStr}`;
        document.getElementById("dpr-ref-no").textContent = `REF: ${refNo}`;

        // Show Modal
        if (dprModalOverlay) {
            dprModalOverlay.style.display = "flex";
            document.body.style.overflow = "hidden";
        }
    }

    function closeDprModal() {
        if (dprModalOverlay) {
            dprModalOverlay.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    if (openDprModalBtn) openDprModalBtn.addEventListener("click", generateBankDPR);
    if (headerDprBtn) headerDprBtn.addEventListener("click", generateBankDPR);
    if (dprCloseBtn) dprCloseBtn.addEventListener("click", closeDprModal);

    if (dprModalOverlay) {
        dprModalOverlay.addEventListener("click", function (e) {
            if (e.target === dprModalOverlay) closeDprModal();
        });
    }

    if (dprPrintBtn) {
        dprPrintBtn.addEventListener("click", function () {
            window.print();
        });
    }


    // ==========================================
    // 6. AI ASSISTANT CHAT ENGINE
    // ==========================================
    const chatViewport = document.getElementById("chat-messages");
    const aiInput = document.getElementById("ai-user-query");
    const aiSubmitBtn = document.getElementById("ai-submit-btn");
    const chips = document.querySelectorAll(".suggestion-chips .chip");

    const smartResponses = {
        "mudra": "Under the Pradhan Mantri Mudra Yojana (PMMY), small entrepreneurs can access collateral-free institutional loans up to ₹10 Lakhs. It is categorized into: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakhs), and Tarun (₹5 Lakhs to ₹10 Lakhs). You can apply via any commercial bank branch or through the official Udyamimitra portal with your Aadhaar, PAN, and machinery quotation.",
        "pmegp": "Under the PMEGP scheme, the maximum project cost sanctioned is ₹50 Lakhs for manufacturing units and ₹20 Lakhs for service sector enterprises. Eligible entrepreneurs receive a government margin money subsidy between 15% and 35%, significantly reducing the effective repayment burden.",
        "margin": "To calculate retail profit margin, use the formula: ((Selling Price - Purchase Cost) / Selling Price) * 100. In fast-moving grocery (FMCG), healthy gross margins typically range between 12% and 18%, whereas specialized garments and food services usually maintain margins between 30% and 45%.",
        "dpr": "A bank-compliant Detailed Project Report (DPR) requires five essential sections: 1. Business Profile & Promoter Background, 2. Plant, Machinery & Infrastructure Setup Cost, 3. 3-Month Working Capital Requirements, 4. 3-Year Projected Profit & Loss Statement, and 5. Break-Even Analysis. Click the 'Download Bank DPR' button above to generate this report in 1 click!"
    };

    function appendMessage(text, sender = "bot") {
        if (!chatViewport) return;
        const bubble = document.createElement("div");
        bubble.className = `chat-bubble ${sender}`;

        const iconClass = sender === "bot" ? "fa-robot" : "fa-user";
        bubble.innerHTML = `
            <div class="bubble-icon"><i class="fa-solid ${iconClass}"></i></div>
            <div class="bubble-content">${text}</div>
        `;
        chatViewport.appendChild(bubble);
        chatViewport.scrollTop = chatViewport.scrollHeight;
    }

    function processAiQuery(query) {
        if (!query.trim()) return;
        appendMessage(query, "user");
        if (aiInput) aiInput.value = "";

        setTimeout(() => {
            const q = query.toLowerCase();
            let matchedReply = "That is a great question! For this, we recommend completing your Profile details first to check exact subsidy eligibility. You can ask specifically about Mudra loans, PMEGP subsidies, or generate your 1-click Bank DPR report above.";

            if (q.includes("mudra")) matchedReply = smartResponses["mudra"];
            else if (q.includes("pmegp") || q.includes("subsidy")) matchedReply = smartResponses["pmegp"];
            else if (q.includes("margin") || q.includes("profit") || q.includes("retail")) matchedReply = smartResponses["margin"];
            else if (q.includes("dpr") || q.includes("bank") || q.includes("report") || q.includes("checklist")) matchedReply = smartResponses["dpr"];

            appendMessage(matchedReply, "bot");
        }, 400);
    }

    if (aiSubmitBtn && aiInput) {
        aiSubmitBtn.addEventListener("click", () => processAiQuery(aiInput.value));
        aiInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") processAiQuery(aiInput.value);
        });
    }

    chips.forEach(chip => {
        chip.addEventListener("click", function () {
            const prompt = this.getAttribute("data-prompt");
            processAiQuery(prompt);
        });
    });


    // ==========================================
    // 7. BUSINESS LEDGER / KHATA LOGGER
    // ==========================================
    const addTxnBtn = document.getElementById("add-txn-btn");
    const txnDesc = document.getElementById("txn-desc");
    const txnType = document.getElementById("txn-type");
    const txnAmount = document.getElementById("txn-amount");

    let currentSales = 85000;
    let currentPurchases = 48000;
    let currentExpenses = 11000;

    function refreshKpis() {
        const salesEl = document.getElementById("stat-sales-val");
        const purchasesEl = document.getElementById("stat-purchases-val");
        const expensesEl = document.getElementById("stat-expenses-val");
        const profitEl = document.getElementById("stat-profit-val");

        if (salesEl) salesEl.textContent = formatINR(currentSales);
        if (purchasesEl) purchasesEl.textContent = formatINR(currentPurchases);
        if (expensesEl) expensesEl.textContent = formatINR(currentExpenses);

        const netProfit = currentSales - (currentPurchases + currentExpenses);
        if (profitEl) {
            profitEl.textContent = formatINR(netProfit);
            profitEl.style.color = netProfit >= 0 ? "var(--emerald)" : "var(--rose)";
        }
    }

    if (addTxnBtn) {
        addTxnBtn.addEventListener("click", function () {
            const amount = parseFloat(txnAmount?.value);
            const desc = txnDesc?.value.trim();
            const type = txnType?.value;

            if (!amount || isNaN(amount) || amount <= 0) {
                showToast("Please enter a valid transaction amount!", "fa-triangle-exclamation");
                return;
            }

            if (type === "sale") {
                currentSales += amount;
                showToast(`Sale recorded: +${formatINR(amount)}`);
            } else if (type === "purchase") {
                currentPurchases += amount;
                showToast(`Inventory purchase recorded: -${formatINR(amount)}`);
            } else if (type === "expense") {
                currentExpenses += amount;
                showToast(`Operating expense recorded: -${formatINR(amount)}`);
            }

            refreshKpis();
            if (txnDesc) txnDesc.value = "";
            if (txnAmount) txnAmount.value = "";
        });
    }

    console.log("Samarth Business Platform (SIH26092) - Bank DPR Engine Ready.");
});
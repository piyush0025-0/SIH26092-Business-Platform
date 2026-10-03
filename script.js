// ==========================================================================
// SAMARTH BUSINESS PLATFORM (SIH26092) - MAIN APPLICATION ENGINE
// ==========================================================================

// Global Schemes Dataset (Accessible across dashboard and detail pages)
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
        collateral: "Exempt under CGTMSE",
        tenure: "3 to 7 Years",
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
        collateral: "Nil (Exempt by RBI)",
        tenure: "Up to 5 Years",
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
        collateral: "Nil",
        tenure: "1 Year per Tranche",
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
        collateral: "Credit Guarantee Fund",
        tenure: "Up to 7 Years",
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
        collateral: "Nil",
        tenure: "Up to 5 Years",
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
        maxLoan: "Up to ₹5,00,000",
        subsidy: "Up to 85% Govt Guarantee Cover",
        collateral: "Covered by CGTMSE Trust",
        tenure: "As per Bank appraisal",
        link: "https://www.cgtmse.in/"
    }
];

// Helper: retrieve scheme by ID
window.getSchemeById = function (id) {
    return schemesData.find(s => s.id === id) || schemesData[0];
};

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
    // 2. PROFILE ENGINE
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
            showToast("Profile saved & synchronized with AI Fund Planner!");

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
                <div class="scheme-actions-row">
                    <a href="scheme-detail.html?id=${scheme.id}" class="btn btn-primary scheme-btn">
                        <span>View Details & Guide</span> <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
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
    // 4. AI-POWERED SMART FUND PLANNER
    // ==========================================
    const loanRange = document.getElementById("loan-range");
    const savingsRange = document.getElementById("savings-range");
    const displayLoan = document.getElementById("display-loan-amount");
    const displaySavings = document.getElementById("display-savings-amount");
    const totalFundValue = document.getElementById("total-fund-value");
    const allocationContainer = document.getElementById("allocation-items");
    const currentTradeBadge = document.getElementById("current-trade-badge");

    // Dynamic AI Models by Trade
    const tradeModels = {
        default: {
            title: "Standard MSME Model",
            explanation: "Balanced distribution compliant with RBI credit guidelines: 32% machinery, 24% inventory, 16% operating buffer, and 10% liquidity reserve.",
            allocations: [
                { name: "Equipment & Machinery", purpose: "Core tools and production hardware", pct: 0.32, color: "#2563eb", icon: "fa-gears" },
                { name: "Initial Stock & Inventory", purpose: "Fast-moving goods and raw materials", pct: 0.24, color: "#059669", icon: "fa-boxes-packing" },
                { name: "3-Month Operating Capital", purpose: "Operating buffer for rent and bills", pct: 0.16, color: "#7c3aed", icon: "fa-coins" },
                { name: "Store Interior & Counter Setup", purpose: "Commercial fit-out and display racks", pct: 0.13, color: "#d97706", icon: "fa-shop" },
                { name: "Emergency Contingency Reserve", purpose: "Liquidity reserve required under bank credit norms", pct: 0.10, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Local Marketing & Signage", purpose: "Signboard and digital outreach", pct: 0.05, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        grocery: {
            title: "Retail Grocery & Kirana Model",
            explanation: "Retail grocery depends heavily on inventory turnover. AI has allocated 36% directly to fast-moving stock and lowered machinery allocation to 14%.",
            allocations: [
                { name: "Initial Stock & Fast-Moving FMCG", purpose: "Staples, packaged goods, and daily essentials", pct: 0.36, color: "#059669", icon: "fa-boxes-packing" },
                { name: "Shop Fixtures, Shelves & Billing POS", purpose: "Display racks, barcode scanner, counter & lighting", pct: 0.20, color: "#d97706", icon: "fa-shop" },
                { name: "Commercial Refrigerator & Weighing Scales", purpose: "Deep freezers, electronic scales & CCTV", pct: 0.14, color: "#2563eb", icon: "fa-gears" },
                { name: "3-Month Working Capital Buffer", purpose: "Rent reserve and supplier advance buffer", pct: 0.16, color: "#7c3aed", icon: "fa-coins" },
                { name: "Emergency Contingency Cash", purpose: "Safeguard against inventory damage / price volatility", pct: 0.10, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Storefront Signboard & Pamphlets", purpose: "Neighbourhood pamphlets and signage", pct: 0.04, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        food: {
            title: "Food Service / Cloud Kitchen Model",
            explanation: "Food businesses require commercial kitchen apparatus, FSSAI compliance, and higher working capital buffer for fresh supply cycles.",
            allocations: [
                { name: "Commercial Kitchen Apparatus", purpose: "Burners, exhaust chimney, ovens & refrigeration", pct: 0.32, color: "#2563eb", icon: "fa-utensils" },
                { name: "Kitchen Setup, Gas Pipeline & FSSAI", purpose: "Sanitation compliance, interior tiling & licenses", pct: 0.20, color: "#d97706", icon: "fa-shop" },
                { name: "3-Month Working Capital & Staff Buffer", purpose: "Chef/helper wages, kitchen rent & utilities", pct: 0.20, color: "#7c3aed", icon: "fa-coins" },
                { name: "Initial Raw Ingredients & Packaging", purpose: "Spices, oil, dry supplies and eco-packaging", pct: 0.14, color: "#059669", icon: "fa-boxes-packing" },
                { name: "Emergency Reserve", purpose: "Food hygiene and emergency equipment repairs", pct: 0.10, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Food Delivery App Onboarding & Ads", purpose: "Zomato/Swiggy launch and branding flyers", pct: 0.04, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        manufacturing: {
            title: "Manufacturing & Fabrication Model",
            explanation: "Manufacturing requires heavy upfront machinery investment (42%) and raw material batch purchasing (22%) with moderate marketing.",
            allocations: [
                { name: "Heavy Machinery & Processing Plant", purpose: "Lathes, cutters, presses or packaging units", pct: 0.42, color: "#2563eb", icon: "fa-gears" },
                { name: "Bulk Raw Material Batch", purpose: "Initial metals, fabrics, chemicals or plastics", pct: 0.22, color: "#059669", icon: "fa-boxes-packing" },
                { name: "Factory Power Setup & Shed Fit-out", purpose: "Industrial electrical wiring, tooling tables & safety", pct: 0.14, color: "#d97706", icon: "fa-industry" },
                { name: "Operating Liquidity Buffer", purpose: "Power bills, transport freight & operator wages", pct: 0.12, color: "#7c3aed", icon: "fa-coins" },
                { name: "Machine Maintenance Contingency", purpose: "Breakdown reserve and calibration spares", pct: 0.08, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "B2B Catalog & Industrial Sampling", purpose: "Sample catalogs and vendor registration", pct: 0.02, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        garments: {
            title: "Apparel & Garment Boutique Model",
            explanation: "Apparel business focuses on trend inventory (36%) and elegant showroom ambiance (22%) with low machinery overheads.",
            allocations: [
                { name: "Ready Inventory & Fashion Apparel", purpose: "Wholesale stock of ethnic wear, casuals & fabrics", pct: 0.36, color: "#059669", icon: "fa-shirt" },
                { name: "Showroom Ambience, Mirrors & Racks", purpose: "Mannequins, trail rooms, spotlights & hangers", pct: 0.22, color: "#d97706", icon: "fa-shop" },
                { name: "3-Month Boutique Operating Buffer", purpose: "Commercial market rent and power backup", pct: 0.18, color: "#7c3aed", icon: "fa-coins" },
                { name: "Sewing, Alteration & Steam Iron Units", purpose: "Industrial sewing machines and steam iron press", pct: 0.12, color: "#2563eb", icon: "fa-gears" },
                { name: "Emergency Contingency Reserve", purpose: "Buffer against seasonal demand fluctuations", pct: 0.08, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Social Media Ads & Local Signage", purpose: "Instagram catalog promotion and banner signage", pct: 0.04, color: "#db2777", icon: "fa-bullhorn" }
            ]
        }
    };

    let activeAllocationConfig = tradeModels.default.allocations;

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
            activeAllocationConfig.forEach(item => {
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

    // AI Smart Budget Trigger
    const aiBudgetBtn = document.getElementById("ai-generate-budget-btn");
    const aiTradeInput = document.getElementById("ai-budget-trade-input");
    const aiExplanationBox = document.getElementById("ai-budget-explanation");
    const aiExplanationText = document.getElementById("ai-explanation-text");

    function applyAiBudgetModel(tradeKey, targetAmount = null) {
        const model = tradeModels[tradeKey] || tradeModels.default;
        activeAllocationConfig = model.allocations;

        if (currentTradeBadge) {
            currentTradeBadge.textContent = model.title;
        }

        if (targetAmount && loanRange && savingsRange) {
            const loanVal = Math.round(targetAmount * 0.75);
            const savingsVal = Math.round(targetAmount * 0.25);
            loanRange.value = loanVal;
            savingsRange.value = savingsVal;
        }

        if (aiExplanationBox && aiExplanationText) {
            aiExplanationBox.style.display = "flex";
            aiExplanationText.innerHTML = `<strong>Samarth AI Insight:</strong> ${model.explanation}`;
        }

        updateFundPlanner();
        showToast(`AI successfully tailored capital allocation for ${model.title}!`);
    }

    if (aiBudgetBtn && aiTradeInput) {
        aiBudgetBtn.addEventListener("click", function () {
            const prompt = aiTradeInput.value.toLowerCase();
            let matchedKey = "default";

            if (prompt.includes("grocer") || prompt.includes("kirana") || prompt.includes("store") || prompt.includes("retail")) {
                matchedKey = "grocery";
            } else if (prompt.includes("food") || prompt.includes("kitchen") || prompt.includes("cafe") || prompt.includes("restaurant")) {
                matchedKey = "food";
            } else if (prompt.includes("mfg") || prompt.includes("fabricat") || prompt.includes("factory") || prompt.includes("manufactur")) {
                matchedKey = "manufacturing";
            } else if (prompt.includes("cloth") || prompt.includes("garment") || prompt.includes("boutique") || prompt.includes("textile")) {
                matchedKey = "garments";
            }

            // Extract numbers if typed like 5 Lakh, 500000, 3.5L
            let targetAmount = null;
            const matchNumber = prompt.match(/(\d+(\.\d+)?)\s*(lakh|lac|l)?/);
            if (matchNumber) {
                const val = parseFloat(matchNumber[1]);
                if (prompt.includes("lakh") || prompt.includes("lac") || matchNumber[3]) {
                    targetAmount = val * 100000;
                } else if (val > 10000) {
                    targetAmount = val;
                }
            }

            applyAiBudgetModel(matchedKey, targetAmount);
        });
    }

    // Trade Chips Clicks
    document.querySelectorAll(".trade-chip").forEach(chip => {
        chip.addEventListener("click", function () {
            const trade = this.getAttribute("data-trade");
            const amount = parseFloat(this.getAttribute("data-amount"));
            applyAiBudgetModel(trade, amount);
        });
    });


    // ==========================================
    // 5. SIMPLIFIED BANK DPR (PROJECT REPORT) GENERATOR
    // ==========================================
    const openDprModalBtn = document.getElementById("open-dpr-modal-btn");
    const openDprNavBtn = document.getElementById("open-dpr-nav-btn");
    const dprModalOverlay = document.getElementById("dpr-modal-overlay");
    const dprCloseBtn = document.getElementById("dpr-close-btn");
    const dprPrintBtn = document.getElementById("dpr-print-btn");

    function generateBankDPR() {
        const name = fields.name?.value.trim() || "Ramesh Kumar";
        const contact = fields.contact?.value.trim() || "9876543210";
        const stage = fields.stage?.value || "New Business (Startup)";
        const category = fields.category?.value || "General MSME";
        const sector = fields.interest?.value.trim() || "Retail Consumer Goods";
        const location = fields.location?.value.trim() || "India";

        const loan = parseFloat(loanRange?.value) || 500000;
        const savings = parseFloat(savingsRange?.value) || 150000;
        const total = loan + savings;

        const savingsPct = ((savings / total) * 100).toFixed(2);
        const loanPct = ((loan / total) * 100).toFixed(2);
        const der = savings > 0 ? (loan / savings).toFixed(2) : "N/A";

        // Fill Promoter Info
        const dprName = document.getElementById("dpr-promoter-name");
        if (dprName) dprName.textContent = name;
        const dprContact = document.getElementById("dpr-promoter-contact");
        if (dprContact) dprContact.textContent = contact;
        const dprStage = document.getElementById("dpr-promoter-stage");
        if (dprStage) dprStage.textContent = stage;
        const dprCat = document.getElementById("dpr-promoter-category");
        if (dprCat) dprCat.textContent = category;
        const dprSector = document.getElementById("dpr-promoter-sector");
        if (dprSector) dprSector.textContent = sector;
        const dprLoc = document.getElementById("dpr-promoter-location");
        if (dprLoc) dprLoc.textContent = location;

        // Fill Financial Info
        const dprSav = document.getElementById("dpr-val-savings");
        if (dprSav) dprSav.textContent = formatINR(savings);
        const dprSavPct = document.getElementById("dpr-pct-savings");
        if (dprSavPct) dprSavPct.textContent = `${savingsPct}%`;
        const dprLoan = document.getElementById("dpr-val-loan");
        if (dprLoan) dprLoan.textContent = formatINR(loan);
        const dprLoanPct = document.getElementById("dpr-pct-loan");
        if (dprLoanPct) dprLoanPct.textContent = `${loanPct}%`;
        const dprTot = document.getElementById("dpr-val-total");
        if (dprTot) dprTot.textContent = formatINR(total);
        const dprDer = document.getElementById("dpr-der-ratio");
        if (dprDer) dprDer.textContent = `${der} : 1`;

        // Fill Simplified Allocation Table
        const tbody = document.getElementById("dpr-allocation-tbody");
        if (tbody) {
            tbody.innerHTML = "";
            activeAllocationConfig.forEach(item => {
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

        // Scheme Linkage
        const dprSchemeName = document.getElementById("dpr-scheme-name");
        const dprSchemeSubsidy = document.getElementById("dpr-scheme-subsidy");

        if (dprSchemeName && dprSchemeSubsidy) {
            if (loan <= 1000000) {
                dprSchemeName.textContent = "Pradhan Mantri Mudra Yojana (PMMY)";
                dprSchemeSubsidy.textContent = "Collateral-Free Institutional Loan Facility";
            } else {
                dprSchemeName.textContent = "Prime Minister Employment Generation Programme (PMEGP)";
                dprSchemeSubsidy.textContent = category.includes("SC") || category.includes("Women") || category.includes("OBC")
                    ? "25% - 35% Govt Margin Money Capital Subsidy"
                    : "15% - 25% Govt Margin Money Capital Subsidy";
            }
        }

        // Meta info
        const now = new Date();
        const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const refEl = document.getElementById("dpr-ref-no");
        if (refEl) refEl.textContent = `REF: SIH-DPR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const dateEl = document.getElementById("dpr-date");
        if (dateEl) dateEl.textContent = `Date: ${dateStr}`;

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
    if (openDprNavBtn) openDprNavBtn.addEventListener("click", generateBankDPR);
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
        "mudra": "Under the Pradhan Mantri Mudra Yojana (PMMY), small entrepreneurs can access collateral-free institutional loans up to ₹10 Lakhs. It is categorized into: Shishu (up to ₹50,000), Kishore (₹50,000 to ₹5 Lakhs), and Tarun (₹5 Lakhs to ₹10 Lakhs). You can apply via any commercial bank branch or through the official Udyamimitra portal.",
        "pmegp": "Under the PMEGP scheme, the maximum project cost sanctioned is ₹50 Lakhs for manufacturing units and ₹20 Lakhs for service sector enterprises. Eligible entrepreneurs receive a government margin money subsidy between 15% and 35%, significantly reducing the effective repayment burden.",
        "margin": "To calculate retail profit margin, use the formula: ((Selling Price - Purchase Cost) / Selling Price) * 100. In fast-moving grocery (FMCG), healthy gross margins typically range between 12% and 18%, whereas specialized garments and food services usually maintain margins between 30% and 45%.",
        "dpr": "A bank-compliant Detailed Project Report (DPR) requires five essential sections: 1. Business Profile & Promoter Background, 2. Plant, Machinery & Infrastructure Setup Cost, 3. 3-Month Working Capital Requirements, 4. 3-Year Projected Profit & Loss Statement, and 5. Break-Even Analysis. Click the 'View & Download Bank DPR' button in the Fund Planner section to export this report in 1 click!"
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
            let matchedReply = "That is a great question! For this, we recommend completing your Profile details first to check exact subsidy eligibility. You can also ask our AI Smart Budget planner above to tailor your capital allocation.";

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

    console.log("Samarth Business Platform (SIH26092) Engine Ready.");
});
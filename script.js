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
        },
        bakery: {
            title: "Bakery & Confectionery Model",
            explanation: "Baking operations require high-precision commercial baking ovens (34%) and fresh raw material batch cycles (24%).",
            allocations: [
                { name: "Commercial Rotary Oven & Dough Mixer", purpose: "Baking ovens, proofing chambers & planetary mixers", pct: 0.34, color: "#2563eb", icon: "fa-gears" },
                { name: "Premium Flour, Butter & Dairy Batch", purpose: "Baking ingredients, chocolates & packaging", pct: 0.24, color: "#059669", icon: "fa-boxes-packing" },
                { name: "Glass Cake Chiller & Display Counters", purpose: "Refrigerated pastry display and billing counter", pct: 0.18, color: "#d97706", icon: "fa-shop" },
                { name: "3-Month Operating Buffer & Wages", purpose: "Chef wages, power backup and store rent", pct: 0.14, color: "#7c3aed", icon: "fa-coins" },
                { name: "Emergency Contingency Cash", purpose: "Ingredient price fluctuations & maintenance reserve", pct: 0.06, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Packaging Branding & Tasting Sampling", purpose: "Custom boxes, tasting samples & launch flyers", pct: 0.04, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        pharmacy: {
            title: "Retail Pharmacy & Medical Store Model",
            explanation: "Retail chemist shops require licensed pharmaceutical inventory (44%) and compliance air-conditioned storage (20%).",
            allocations: [
                { name: "Pharma Inventory & Branded Medicines", purpose: "Prescription drugs, OTC medicines & surgicals", pct: 0.44, color: "#059669", icon: "fa-boxes-packing" },
                { name: "Glass Racks, Drug Licensing & POS", purpose: "Compliance racks, Drug License fees & billing software", pct: 0.20, color: "#d97706", icon: "fa-shop" },
                { name: "Medical Refrigerator & Inverter Backup", purpose: "Vaccine chillers, 24x7 inverter power & CCTV", pct: 0.16, color: "#2563eb", icon: "fa-bolt" },
                { name: "3-Month Pharmacist Buffer & Rent", purpose: "Registered pharmacist salary & store rent buffer", pct: 0.12, color: "#7c3aed", icon: "fa-coins" },
                { name: "Emergency Contingency Reserve", purpose: "Buffer against batch expiry & regulatory updates", pct: 0.05, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Doctor Tie-up & Local Health Camps", purpose: "Clinic tie-up pamphlets & local signage", pct: 0.03, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        electronics: {
            title: "Mobile & Electronics Retail/Service Model",
            explanation: "Electronics stores invest heavily in fast-moving mobile stock and accessories (40%) and precision repair tooling (16%).",
            allocations: [
                { name: "Mobile Phones & Accessory Inventory", purpose: "Smartphones, chargers, audio gear & covers", pct: 0.40, color: "#059669", icon: "fa-boxes-packing" },
                { name: "Security Showcases & Acrylic Display", purpose: "Anti-theft display tables, glass counters & branding", pct: 0.20, color: "#d97706", icon: "fa-shop" },
                { name: "SMD Rework Station & Repair Lab", purpose: "Microscope, soldering heat guns & diagnostic software", pct: 0.16, color: "#2563eb", icon: "fa-gears" },
                { name: "3-Month Working Capital & Technician", purpose: "Technician stipends, market rent & utilities", pct: 0.14, color: "#7c3aed", icon: "fa-coins" },
                { name: "Warranty Claim Contingency Cash", purpose: "Customer replacement buffer and part repairs", pct: 0.06, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Local Exchange Campaign & Ads", purpose: "Screen protection promos & Instagram campaigns", pct: 0.04, color: "#db2777", icon: "fa-bullhorn" }
            ]
        },
        salon: {
            title: "Salon, Spa & Beauty Care Model",
            explanation: "Salons focus on luxury styling stations (30%), premium cosmetics stock (25%), and trained stylists buffer (25%).",
            allocations: [
                { name: "Styling Chairs, Mirrors & Wash Basins", purpose: "Hydraulic chairs, shampoo stations & facial beds", pct: 0.30, color: "#d97706", icon: "fa-shop" },
                { name: "Premium Cosmetics & Hair Care Stock", purpose: "Keratin kits, skin treatments & imported serums", pct: 0.25, color: "#059669", icon: "fa-boxes-packing" },
                { name: "3-Month Stylist Wages & Salon Rent", purpose: "Senior stylist payouts, salon rent & air-conditioning", pct: 0.22, color: "#7c3aed", icon: "fa-coins" },
                { name: "Professional Blow Dryers & Sterilizers", purpose: "UV tool sterilizers, ozone steamers & curlers", pct: 0.12, color: "#2563eb", icon: "fa-gears" },
                { name: "Hygiene & Equipment Breakdown Reserve", purpose: "Hygiene disposable items & electrical backups", pct: 0.06, color: "#0891b2", icon: "fa-shield-heart" },
                { name: "Bridal Package Ads & Influencer Tie-up", purpose: "Local bridal promotions & social media reels", pct: 0.05, color: "#db2777", icon: "fa-bullhorn" }
            ]
        }
    };

    // Deep copy initial allocation config
    let activeAllocationConfig = JSON.parse(JSON.stringify(tradeModels.default.allocations));

    // Color conversion helper for soft pill backgrounds
    function hexToRgba(hex, alpha = 0.12) {
        if (!hex) return `rgba(37, 99, 235, ${alpha})`;
        let cleanHex = hex.replace('#', '');
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
        const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
        const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // Normalize allocations so they strictly equal 1.0 (100%)
    function normalizeAllocations() {
        if (!activeAllocationConfig || activeAllocationConfig.length === 0) return;
        const totalPct = activeAllocationConfig.reduce((sum, item) => sum + item.pct, 0);
        if (totalPct <= 0) return;
        activeAllocationConfig.forEach(item => {
            item.pct = parseFloat((item.pct / totalPct).toFixed(4));
        });
    }

    // Add custom expense item
    function addExpenseItem(name, purpose, pctOrAmount, icon = "fa-coins", color = null) {
        const loan = parseFloat(loanRange?.value) || 0;
        const savings = parseFloat(savingsRange?.value) || 0;
        const total = loan + savings;

        let pct = 0.10;
        if (pctOrAmount < 1 && pctOrAmount > 0) {
            pct = pctOrAmount;
        } else if (pctOrAmount >= 1 && pctOrAmount <= 100) {
            pct = pctOrAmount / 100;
        } else if (pctOrAmount > 100 && total > 0) {
            pct = Math.max(0.02, Math.min(0.60, pctOrAmount / total));
        }

        const palette = ["#2563eb", "#059669", "#7c3aed", "#d97706", "#0891b2", "#db2777", "#ea580c", "#4f46e5"];
        const chosenColor = color || palette[activeAllocationConfig.length % palette.length];

        // Scale existing allocations down slightly to accommodate the new expense
        const remainingScale = 1 - pct;
        activeAllocationConfig.forEach(item => {
            item.pct = item.pct * remainingScale;
        });

        activeAllocationConfig.push({
            name: name,
            purpose: purpose || "Custom business expenditure category",
            pct: pct,
            color: chosenColor,
            icon: icon || "fa-coins"
        });

        normalizeAllocations();
        if (currentTradeBadge) currentTradeBadge.textContent = "Customized Allocation";
        updateFundPlanner();
        showToast(`Added custom expense "${name}"!`);
    }

    // Remove expense item
    function removeExpenseItem(index) {
        if (activeAllocationConfig.length <= 1) {
            showToast("At least one expense category must remain!", "warning");
            return;
        }
        const removed = activeAllocationConfig.splice(index, 1)[0];
        normalizeAllocations();
        if (currentTradeBadge) currentTradeBadge.textContent = "Customized Allocation";
        updateFundPlanner();
        showToast(`Removed "${removed.name}" and re-balanced remaining allocations.`, "info");
    }

    // Update expense percentage directly
    function updateExpensePercentage(index, targetPct) {
        if (!activeAllocationConfig[index]) return;
        activeAllocationConfig[index].pct = Math.max(0.01, Math.min(0.85, targetPct));
        normalizeAllocations();
        if (currentTradeBadge) currentTradeBadge.textContent = "Customized Allocation";
        updateFundPlanner();
    }

    // Step expense percentage by +/- delta
    function stepExpensePercentage(index, delta) {
        if (!activeAllocationConfig[index]) return;
        const newPct = activeAllocationConfig[index].pct + delta;
        activeAllocationConfig[index].pct = Math.max(0.02, Math.min(0.85, newPct));
        normalizeAllocations();
        if (currentTradeBadge) currentTradeBadge.textContent = "Customized Allocation";
        updateFundPlanner();
    }

    // Edit existing expense item
    function editExpenseItem(index, name, purpose, pct, icon) {
        if (!activeAllocationConfig[index]) return;
        activeAllocationConfig[index].name = name;
        activeAllocationConfig[index].purpose = purpose;
        if (pct) activeAllocationConfig[index].pct = pct;
        if (icon) activeAllocationConfig[index].icon = icon;
        normalizeAllocations();
        if (currentTradeBadge) currentTradeBadge.textContent = "Customized Allocation";
        updateFundPlanner();
        showToast(`Updated expense "${name}"!`);
    }

    // Reset allocations to standard model
    function resetAllocations() {
        activeAllocationConfig = JSON.parse(JSON.stringify(tradeModels.default.allocations));
        if (currentTradeBadge) currentTradeBadge.textContent = tradeModels.default.title;
        updateFundPlanner();
        showToast("Reset Capital Allocation Breakdown to standard MSME model.", "info");
    }

    // Auto-balance allocations to exact 100%
    function autoBalanceAllocations() {
        normalizeAllocations();
        updateFundPlanner();
        showToast("Auto-balanced all allocations to exact 100%!", "success");
    }

    // Scroll to Allocation with glow highlight
    function scrollToAllocation() {
        const section = document.getElementById("fund-breakdown-section") || document.getElementById("fund-planner");
        if (section) {
            section.scrollIntoView({ behavior: "smooth", block: "center" });
            section.classList.remove("highlight-target");
            void section.offsetWidth; // trigger reflow
            section.classList.add("highlight-target");
            setTimeout(() => section.classList.remove("highlight-target"), 3500);
        }
    }
    window.scrollToAllocation = scrollToAllocation;

    // Main Fund Planner & Visual Breakdown Renderer
    function updateFundPlanner() {
        if (!loanRange || !savingsRange) return;

        const loan = parseFloat(loanRange.value) || 0;
        const savings = parseFloat(savingsRange.value) || 0;
        const total = loan + savings;

        if (displayLoan) displayLoan.textContent = formatINR(loan);
        if (displaySavings) displaySavings.textContent = formatINR(savings);
        if (totalFundValue) totalFundValue.textContent = formatINR(total);

        // Update live allocation balance status bar
        const totalPctSum = activeAllocationConfig.reduce((sum, item) => sum + item.pct, 0);
        const totalPctRound = Math.round(totalPctSum * 100);

        const allocTotalPct = document.getElementById("alloc-total-pct");
        const allocTotalVal = document.getElementById("alloc-total-val");
        const btnBalanceAlloc = document.getElementById("btn-balance-alloc");

        if (allocTotalPct) {
            allocTotalPct.textContent = `${totalPctRound}%`;
            if (totalPctRound === 100) {
                allocTotalPct.className = "alloc-status-pct badge-pill pill-emerald";
            } else if (totalPctRound > 100) {
                allocTotalPct.className = "alloc-status-pct badge-pill pill-rose";
            } else {
                allocTotalPct.className = "alloc-status-pct badge-pill pill-amber";
            }
        }

        if (allocTotalVal) {
            allocTotalVal.textContent = formatINR(total);
        }

        if (btnBalanceAlloc) {
            btnBalanceAlloc.style.display = totalPctRound !== 100 ? "inline-flex" : "none";
        }

        if (allocationContainer) {
            allocationContainer.innerHTML = "";
            activeAllocationConfig.forEach((item, idx) => {
                const itemAmount = total * item.pct;
                const itemPctRound = Math.round(item.pct * 100);
                const softBg = hexToRgba(item.color, 0.12);

                const row = document.createElement("div");
                row.className = "alloc-item";
                row.setAttribute("data-index", idx);
                row.innerHTML = `
                    <div class="alloc-info">
                        <div class="alloc-left">
                            <div class="alloc-icon" style="background-color: ${softBg}; color: ${item.color};">
                                <i class="fa-solid ${item.icon}"></i>
                            </div>
                            <div class="alloc-text">
                                <span class="alloc-title" title="${item.name}">${item.name}</span>
                                <span class="alloc-purpose" title="${item.purpose}">${item.purpose}</span>
                            </div>
                        </div>
                        <div class="alloc-right">
                            <div class="alloc-amount-wrap">
                                <span class="alloc-amount">${formatINR(itemAmount)}</span>
                                <span class="alloc-pct-badge" style="background-color: ${softBg}; color: ${item.color};">${itemPctRound}%</span>
                            </div>
                            <div class="alloc-actions">
                                <button type="button" class="btn-alloc-step" data-action="dec" data-index="${idx}" title="Decrease by 2%"><i class="fa-solid fa-minus"></i></button>
                                <button type="button" class="btn-alloc-step" data-action="inc" data-index="${idx}" title="Increase by 2%"><i class="fa-solid fa-plus"></i></button>
                                <button type="button" class="btn-alloc-action edit" data-action="edit" data-index="${idx}" title="Edit expense"><i class="fa-solid fa-pen-to-square"></i></button>
                                <button type="button" class="btn-alloc-action delete" data-action="del" data-index="${idx}" title="Delete expense"><i class="fa-solid fa-trash-can"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="alloc-slider-row">
                        <input type="range" class="alloc-range-slider" min="1" max="80" step="1" value="${itemPctRound}" data-index="${idx}" style="accent-color: ${item.color};">
                    </div>
                    <div class="alloc-bar-track">
                        <div class="alloc-bar-fill" style="width: ${itemPctRound}%; background-color: ${item.color};"></div>
                    </div>
                `;
                allocationContainer.appendChild(row);
            });

            // Bind events for step buttons, edit, delete, and sliders
            allocationContainer.querySelectorAll(".btn-alloc-step").forEach(btn => {
                btn.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    const action = this.getAttribute("data-action");
                    stepExpensePercentage(idx, action === "inc" ? 0.02 : -0.02);
                });
            });

            allocationContainer.querySelectorAll(".btn-alloc-action.delete").forEach(btn => {
                btn.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    removeExpenseItem(idx);
                });
            });

            allocationContainer.querySelectorAll(".btn-alloc-action.edit").forEach(btn => {
                btn.addEventListener("click", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    openExpenseModal(idx);
                });
            });

            allocationContainer.querySelectorAll(".alloc-range-slider").forEach(slider => {
                slider.addEventListener("input", function () {
                    const idx = parseInt(this.getAttribute("data-index"));
                    const targetPct = parseFloat(this.value) / 100;
                    updateExpensePercentage(idx, targetPct);
                });
            });
        }
    }

    if (loanRange && savingsRange) {
        loanRange.addEventListener("input", updateFundPlanner);
        savingsRange.addEventListener("input", updateFundPlanner);
        updateFundPlanner();
    }

    // Custom Expense Modal Management
    const expenseModalOverlay = document.getElementById("expense-modal-overlay");
    const expenseModalForm = document.getElementById("expense-modal-form");
    const expenseModalTitle = document.getElementById("expense-modal-title");
    const expenseEditIndex = document.getElementById("expense-edit-index");
    const expenseNameInput = document.getElementById("expense-name-input");
    const expensePurposeInput = document.getElementById("expense-purpose-input");
    const expensePctInput = document.getElementById("expense-pct-input");
    const expenseIconSelect = document.getElementById("expense-icon-select");
    const expenseModalClose = document.getElementById("expense-modal-close");
    const expenseModalCancel = document.getElementById("expense-modal-cancel");
    const expenseModalBtnText = document.getElementById("expense-modal-btn-text");
    const btnOpenAddExpense = document.getElementById("btn-open-add-expense");
    const btnResetAllocations = document.getElementById("btn-reset-allocations");
    const btnBalanceAlloc = document.getElementById("btn-balance-alloc");

    function openExpenseModal(editIndex = -1) {
        if (!expenseModalOverlay) return;
        expenseEditIndex.value = editIndex;

        if (editIndex >= 0 && activeAllocationConfig[editIndex]) {
            const item = activeAllocationConfig[editIndex];
            expenseModalTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Edit Expense: ${item.name}`;
            expenseNameInput.value = item.name;
            expensePurposeInput.value = item.purpose;
            expensePctInput.value = Math.round(item.pct * 100);
            expenseIconSelect.value = item.icon || "fa-coins";
            expenseModalBtnText.textContent = "Save Changes";
        } else {
            expenseModalTitle.innerHTML = `<i class="fa-solid fa-coins"></i> Add Custom Expense Category`;
            expenseNameInput.value = "";
            expensePurposeInput.value = "";
            expensePctInput.value = 10;
            expenseIconSelect.value = "fa-coins";
            expenseModalBtnText.textContent = "Add Expense";
        }

        expenseModalOverlay.style.display = "flex";
        expenseNameInput.focus();
    }

    function closeExpenseModal() {
        if (expenseModalOverlay) expenseModalOverlay.style.display = "none";
    }

    if (btnOpenAddExpense) {
        btnOpenAddExpense.addEventListener("click", () => openExpenseModal(-1));
    }

    if (btnResetAllocations) {
        btnResetAllocations.addEventListener("click", resetAllocations);
    }

    if (btnBalanceAlloc) {
        btnBalanceAlloc.addEventListener("click", autoBalanceAllocations);
    }

    if (expenseModalClose) expenseModalClose.addEventListener("click", closeExpenseModal);
    if (expenseModalCancel) expenseModalCancel.addEventListener("click", closeExpenseModal);
    if (expenseModalOverlay) {
        expenseModalOverlay.addEventListener("click", (e) => {
            if (e.target === expenseModalOverlay) closeExpenseModal();
        });
    }

    if (expenseModalForm) {
        expenseModalForm.addEventListener("submit", function (e) {
            e.preventDefault();
            const idx = parseInt(expenseEditIndex.value);
            const name = expenseNameInput.value.trim();
            const purpose = expensePurposeInput.value.trim();
            const pct = parseFloat(expensePctInput.value) / 100;
            const icon = expenseIconSelect.value;

            if (!name) return;

            if (idx >= 0) {
                editExpenseItem(idx, name, purpose, pct, icon);
            } else {
                addExpenseItem(name, purpose, pct, icon);
            }

            closeExpenseModal();
        });
    }

    // Bilingual Language State & Detection
    let currentAiLanguage = localStorage.getItem("samarth_ai_lang") || "hinglish";

    function detectHinglish(text) {
        if (!text) return false;
        const lower = text.toLowerCase();
        const hindiWords = [
            "kya", "kaise", "kitna", "kitne", "kitni", "karo", "karna", "kar do", "batao", "batayein", 
            "chahiye", "dukan", "kharcha", "kharche", "paisa", "paise", "rupaye", "badhao", "badha do", 
            "kam karo", "ghatao", "shuru", "namaste", "pranam", "kripya", "sarkari", "yojana", "yojna",
            "hatao", "hata do", "daalo", "rakho", "kharidna", "bikri", "munafa", "vyapar", "meri", "mera", 
            "mujhe", "humko", "apna", "apne", "bhi", "aur", "mein", "me", "hai", "hain", "hoga", "milega",
            "milegi", "jankari", "jaankari", "bataiye", "samjhao", "madad", "bhai", "ji", "sahab"
        ];
        return hindiWords.some(w => new RegExp(`(?:^|\\s|[^a-zA-Z0-9])${w}(?:$|\\s|[^a-zA-Z0-9])`, "i").test(lower));
    }

    // AI Natural Language Expense Command Handler (Used by both inline bar and chatbot)
    function handleAiExpenseCommand(query, options = {}) {
        if (!query || !query.trim()) return { handled: false };
        const q = query.toLowerCase().trim();
        const isHinglish = currentAiLanguage === "hinglish" || detectHinglish(query);

        // 1. Trade Preset Match (e.g. Grocery, Bakery, Cloud Kitchen, etc.)
        let matchedTrade = null;
        if (q.includes("grocer") || q.includes("kirana") || q.includes("supermarket") || q.includes("ration")) {
            matchedTrade = "grocery";
        } else if (q.includes("cloud kitchen") || q.includes("food") || q.includes("cafe") || q.includes("restaurant") || q.includes("dhaba")) {
            matchedTrade = "food";
        } else if (q.includes("bakery") || q.includes("cake") || q.includes("pastry") || q.includes("confection")) {
            matchedTrade = "bakery";
        } else if (q.includes("pharma") || q.includes("medical") || q.includes("chemist") || q.includes("medicine") || q.includes("dawa")) {
            matchedTrade = "pharmacy";
        } else if (q.includes("mobile") || q.includes("electron") || q.includes("laptop") || q.includes("phone repair")) {
            matchedTrade = "electronics";
        } else if (q.includes("salon") || q.includes("parlour") || q.includes("beauty") || q.includes("spa") || q.includes("barber")) {
            matchedTrade = "salon";
        } else if (q.includes("mfg") || q.includes("fabricat") || q.includes("factory") || q.includes("manufactur") || q.includes("workshop")) {
            matchedTrade = "manufacturing";
        } else if (q.includes("cloth") || q.includes("garment") || q.includes("boutique") || q.includes("textile") || q.includes("tailor")) {
            matchedTrade = "garments";
        }

        // Extract amount if specified (e.g. 5 Lakh, ₹5,00,000, 3.5L, 500000)
        let targetAmount = null;
        const matchNumber = q.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|l|k|thousand)?/i);
        if (matchNumber) {
            const num = parseFloat(matchNumber[1]);
            const unit = (matchNumber[2] || "").toLowerCase();
            if (unit.includes("lakh") || unit.includes("lac") || unit === "l") {
                targetAmount = num * 100000;
            } else if (unit.includes("k") || unit.includes("thousand")) {
                targetAmount = num * 1000;
            } else if (num > 10000) {
                targetAmount = num;
            }
        }

        // If matched a trade model
        if (matchedTrade && (q.includes("model") || q.includes("budget") || q.includes("setup") || q.includes("start") || q.includes("shuru") || q.includes("dukan") || q.includes("shop") || q.includes("plan"))) {
            applyAiBudgetModel(matchedTrade, targetAmount);
            const model = tradeModels[matchedTrade];
            const msg = isHinglish
                ? `✨ AI ne aapke Capital Allocation Breakdown ko **${model.title}** ke anusaar set kar diya hai! ${model.explanation}`
                : `✨ AI has tailored your Capital Allocation Breakdown for **${model.title}**! ${model.explanation}`;
            return {
                handled: true,
                success: true,
                type: "trade_model",
                message: msg
            };
        }

        // 2. Add New Expense Command
        // e.g. "add delivery bike 40000", "naya expense add karo: CCTV camera ₹25,000", "add 5% for marketing"
        if (q.includes("add") || q.includes("naya") || q.includes("shamil") || q.includes("include") || q.includes("daalo") || q.includes("rakho") || q.includes("kharid")) {
            // Find amount or percentage
            let allocValue = 0.10;
            const pctMatch = q.match(/(\d+)%/);
            const amtMatch = q.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(lakh|lac|l|k|thousand)?/i);

            if (pctMatch) {
                allocValue = parseFloat(pctMatch[1]) / 100;
            } else if (amtMatch) {
                const num = parseFloat(amtMatch[1]);
                const unit = (amtMatch[2] || "").toLowerCase();
                if (unit.includes("lakh") || unit.includes("lac") || unit === "l") {
                    allocValue = num * 100000;
                } else if (unit.includes("k") || unit.includes("thousand")) {
                    allocValue = num * 1000;
                } else if (num > 100) {
                    allocValue = num;
                }
            }

            // Clean item name from query
            let cleanName = query
                .replace(/add\s+expense:?/gi, "")
                .replace(/add/gi, "")
                .replace(/naya\s+expense:?/gi, "")
                .replace(/naya\s+kharcha:?/gi, "")
                .replace(/naya/gi, "")
                .replace(/shamil\s+karo/gi, "")
                .replace(/add\s+karo/gi, "")
                .replace(/daalo/gi, "")
                .replace(/rakho/gi, "")
                .replace(/kharid/gi, "")
                .replace(/₹\s*\d+(?:,\d+)*(?:\.\d+)?/gi, "")
                .replace(/\d+\s*(lakh|lac|l|k|thousand|%)/gi, "")
                .replace(/for|ke\s+liye|ka|ki/gi, "")
                .trim();

            cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
            if (!cleanName || cleanName.length < 2) cleanName = isHinglish ? "Naya Vyapar Asset" : "Custom Business Asset";

            // Determine appropriate icon
            let icon = "fa-coins";
            const lowerClean = cleanName.toLowerCase();
            if (lowerClean.includes("bike") || lowerClean.includes("van") || lowerClean.includes("scooter") || lowerClean.includes("delivery") || lowerClean.includes("vehicle") || lowerClean.includes("gaadi")) {
                icon = "fa-motorcycle";
            } else if (lowerClean.includes("cctv") || lowerClean.includes("pos") || lowerClean.includes("billing") || lowerClean.includes("software") || lowerClean.includes("computer")) {
                icon = "fa-cash-register";
            } else if (lowerClean.includes("solar") || lowerClean.includes("inverter") || lowerClean.includes("generator") || lowerClean.includes("power") || lowerClean.includes("bijli")) {
                icon = "fa-bolt";
            } else if (lowerClean.includes("freeze") || lowerClean.includes("cold") || lowerClean.includes("refrigerat") || lowerClean.includes("chiller")) {
                icon = "fa-snowflake";
            } else if (lowerClean.includes("pack") || lowerClean.includes("box") || lowerClean.includes("material")) {
                icon = "fa-boxes-packing";
            } else if (lowerClean.includes("ad") || lowerClean.includes("market") || lowerClean.includes("promo") || lowerClean.includes("board")) {
                icon = "fa-bullhorn";
            }

            addExpenseItem(cleanName, isHinglish ? "Naya business kharcha category" : "Custom business expenditure category", allocValue, icon);
            const msg = isHinglish
                ? `✅ **${cleanName}** aapke Capital Allocation Breakdown me shamil ho gaya hai! Baaki categories ko automatically proportionally adjust kar diya gaya hai taki total 100% bana rahe.`
                : `✅ Added **${cleanName}** to your Capital Allocation Breakdown! Remaining categories have been proportionally re-balanced to preserve 100% total.`;
            return {
                handled: true,
                success: true,
                type: "add_expense",
                message: msg
            };
        }

        // 3. Remove / Delete Expense Command
        // e.g. "remove marketing", "local marketing hata do", "delete emergency reserve"
        if (q.includes("remove") || q.includes("delete") || q.includes("hata") || q.includes("nikal") || q.includes("drop")) {
            let foundIdx = -1;
            activeAllocationConfig.forEach((item, i) => {
                const iname = item.name.toLowerCase();
                if (q.includes("market") && iname.includes("market")) foundIdx = i;
                else if (q.includes("stock") && iname.includes("stock")) foundIdx = i;
                else if (q.includes("contingency") && (iname.includes("contingency") || iname.includes("reserve"))) foundIdx = i;
                else if (q.includes("interior") && iname.includes("interior")) foundIdx = i;
                else if (q.includes("machinery") && (iname.includes("machin") || iname.includes("equipment"))) foundIdx = i;
                else if (q.includes("bike") && iname.includes("bike")) foundIdx = i;
                else if (q.includes("pos") && iname.includes("pos")) foundIdx = i;
            });

            if (foundIdx >= 0) {
                const item = activeAllocationConfig[foundIdx];
                removeExpenseItem(foundIdx);
                const msg = isHinglish
                    ? `🗑️ **${item.name}** ko budget se hata diya gaya hai. Baaki categories ka ratio 100% par auto-balance kar diya gaya hai.`
                    : `🗑️ Removed **${item.name}** from your Capital Allocation Breakdown. Remaining categories have been scaled to 100%.`;
                return {
                    handled: true,
                    success: true,
                    type: "remove_expense",
                    message: msg
                };
            }
        }

        // 4. Modify / Increase / Decrease Expense Command
        // e.g. "increase stock to 40%", "marketing kam karo 2%", "machinery badhao"
        const isIncrease = q.includes("increase") || q.includes("badha") || q.includes("raise") || q.includes("more") || q.includes("jyada") || q.includes("zyada") || q.includes("boost");
        const isDecrease = q.includes("decrease") || q.includes("reduce") || q.includes("kam") || q.includes("ghata") || q.includes("cut") || q.includes("lower");

        if (isIncrease || isDecrease) {
            let foundIdx = -1;
            activeAllocationConfig.forEach((item, i) => {
                const iname = item.name.toLowerCase();
                if (q.includes("stock") || q.includes("inventory")) {
                    if (iname.includes("stock") || iname.includes("inventory") || iname.includes("fmcg")) foundIdx = i;
                } else if (q.includes("market") || q.includes("ad") || q.includes("sign")) {
                    if (iname.includes("market") || iname.includes("signage")) foundIdx = i;
                } else if (q.includes("machin") || q.includes("equipment") || q.includes("tool")) {
                    if (iname.includes("machin") || iname.includes("apparatus") || iname.includes("equipment")) foundIdx = i;
                } else if (q.includes("reserve") || q.includes("contingency") || q.includes("emergency")) {
                    if (iname.includes("reserve") || iname.includes("contingency")) foundIdx = i;
                } else if (q.includes("rent") || q.includes("buffer") || q.includes("working capital")) {
                    if (iname.includes("buffer") || iname.includes("capital")) foundIdx = i;
                }
            });

            if (foundIdx >= 0) {
                const item = activeAllocationConfig[foundIdx];
                let targetPct = item.pct;

                const pctMatch = q.match(/(\d+)%/);
                if (pctMatch) {
                    targetPct = parseFloat(pctMatch[1]) / 100;
                } else {
                    targetPct = isIncrease ? item.pct + 0.08 : item.pct - 0.05;
                }

                updateExpensePercentage(foundIdx, targetPct);
                const msg = isHinglish
                    ? `📊 **${item.name}** ko adjust karke **${Math.round(item.pct * 100)}%** kar diya gaya hai! Aapka total budget balance 100% maintain hai.`
                    : `📊 Adjusted **${item.name}** to **${Math.round(item.pct * 100)}%**! Your total allocation remains balanced at 100%.`;
                return {
                    handled: true,
                    success: true,
                    type: "modify_expense",
                    message: msg
                };
            }
        }

        // 5. Auto-Balance Command
        if (q.includes("balance") || q.includes("barabar") || q.includes("theek karo") || q.includes("distribute") || q.includes("100%")) {
            autoBalanceAllocations();
            const msg = isHinglish
                ? `⚖️ Sabhi capital allocation categories ko successfully auto-balance karke exactly 100% kar diya gaya hai!`
                : `⚖️ Successfully auto-balanced all your Capital Allocation Breakdown categories to exactly 100%!`;
            return {
                handled: true,
                success: true,
                type: "balance",
                message: msg
            };
        }

        // 6. Total Budget Command
        if ((q.includes("total") || q.includes("budget") || q.includes("loan") || q.includes("capital")) && targetAmount) {
            const loanVal = Math.round(targetAmount * 0.75);
            const savingsVal = Math.round(targetAmount * 0.25);
            if (loanRange) loanRange.value = loanVal;
            if (savingsRange) savingsRange.value = savingsVal;
            updateFundPlanner();
            const msg = isHinglish
                ? `💰 Total Working Capital **${formatINR(targetAmount)}** update kar diya gaya hai (Bank Loan: ${formatINR(loanVal)}, Personal Equity: ${formatINR(savingsVal)}). Sabhi expenses live update ho gaye hain!`
                : `💰 Updated Total Working Capital to **${formatINR(targetAmount)}** (Bank Loan: ${formatINR(loanVal)}, Personal Equity: ${formatINR(savingsVal)}). All expense allocations automatically updated!`;
            return {
                handled: true,
                success: true,
                type: "budget_update",
                message: msg
            };
        }

        // 7. General Expense Management Guidance
        if (q.includes("expense") || q.includes("kharcha") || q.includes("manage") || q.includes("kaise karu") || q.includes("allocation")) {
            const msg = isHinglish
                ? `💡 **Samarth AI Expense Advice:** Ek mazboot aur safe MSME business ke liye ideal capital distribution yeh hai:
                • **Core Revenue Assets (Stock/Machines):** 35% - 45%
                • **Shop Setup / Interior:** 15% - 20%
                • **Working Capital & Salary Buffer:** 15% - 20%
                • **Emergency Contingency Cash:** 8% - 10%
                • **Marketing & Signage:** 3% - 5%
                
                Aap mujhse kisi bhi samay bol sakte hain: *"Delivery bike add karo ₹40k"*, *"Stock 45% karo"*, ya *"Marketing kam karo 2%"* aur main live update kar doonga!`
                : `💡 **Samarth AI Expense Advice:** For a resilient Indian MSME, ideal allocation is:
                • **Core Revenue Assets (Stock/Machines):** 35% - 45%
                • **Store Setup / Interior:** 15% - 20%
                • **Working Capital & Salary Buffer:** 15% - 20%
                • **Emergency Contingency:** 8% - 10%
                • **Marketing & Signage:** 3% - 5%
                
                You can tell me anytime: *"Add delivery bike ₹40k"*, *"Increase stock to 45%"*, or *"Reduce marketing to 2%"* and I'll adjust it instantly!`;
            return {
                handled: true,
                success: true,
                type: "guidance",
                message: msg
            };
        }

        return { handled: false };
    }

    // Connect Inline AI Bar in Capital Allocation Breakdown
    const allocAiInput = document.getElementById("alloc-ai-input");
    const allocAiBtn = document.getElementById("alloc-ai-btn");

    function executeInlineAiExpenseCommand() {
        if (!allocAiInput) return;
        const cmd = allocAiInput.value.trim();
        if (!cmd) return;

        const res = handleAiExpenseCommand(cmd);
        if (res.handled) {
            showToast(res.message.replace(/[*_#]/g, ''), "success");
            allocAiInput.value = "";
        } else {
            showToast("AI couldn't recognize this expense command. Try: 'Add delivery bike ₹40k' or 'Increase stock to 40%'.", "info");
        }
    }

    if (allocAiBtn && allocAiInput) {
        allocAiBtn.addEventListener("click", executeInlineAiExpenseCommand);
        allocAiInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") executeInlineAiExpenseCommand();
        });
    }

    // Connect Quick Chips in Capital Allocation Breakdown
    document.querySelectorAll(".alloc-chip").forEach(chip => {
        chip.addEventListener("click", function () {
            const cmd = this.getAttribute("data-ai-cmd");
            if (cmd) {
                const res = handleAiExpenseCommand(cmd);
                if (res.handled) {
                    showToast(res.message.replace(/[*_#]/g, ''), "success");
                }
            }
        });
    });

    // AI Smart Budget Trigger
    const aiBudgetBtn = document.getElementById("ai-generate-budget-btn");
    const aiTradeInput = document.getElementById("ai-budget-trade-input");
    const aiExplanationBox = document.getElementById("ai-budget-explanation");
    const aiExplanationText = document.getElementById("ai-explanation-text");

    function applyAiBudgetModel(tradeKey, targetAmount = null) {
        const model = tradeModels[tradeKey] || tradeModels.default;
        activeAllocationConfig = JSON.parse(JSON.stringify(model.allocations));

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
            } else if (prompt.includes("bakery") || prompt.includes("cake") || prompt.includes("pastry")) {
                matchedKey = "bakery";
            } else if (prompt.includes("pharma") || prompt.includes("medical") || prompt.includes("chemist")) {
                matchedKey = "pharmacy";
            } else if (prompt.includes("mobile") || prompt.includes("electron") || prompt.includes("phone")) {
                matchedKey = "electronics";
            } else if (prompt.includes("salon") || prompt.includes("parlour") || prompt.includes("beauty")) {
                matchedKey = "salon";
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
        const name = fields.name?.value.trim() || "Piyush";
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
    // 6. AI ASSISTANT CHAT ENGINE (BILINGUAL: HINGLISH & ENGLISH)
    // ==========================================
    const chatViewport = document.getElementById("chat-messages");
    const aiInput = document.getElementById("ai-user-query");
    const aiSubmitBtn = document.getElementById("ai-submit-btn");
    const chips = document.querySelectorAll(".suggestion-chips .chip");

    // Hinglish Knowledge Base
    const smartResponsesHinglish = {
        "mudra": "<strong>Pradhan Mantri Mudra Yojana (PMMY):</strong><br>Is yojana ke antargat bina kisi collateral (guarantee/property) ke ₹10 Lakh tak ka bank loan milta hai. Isme 3 categories hain:<br>• <strong>Shishu Loan:</strong> ₹50,000 tak (naya vyapar shuru karne ke liye)<br>• <strong>Kishore Loan:</strong> ₹50,000 se ₹5 Lakh tak (dukan ya equipment badhane ke liye)<br>• <strong>Tarun Loan:</strong> ₹5 Lakh se ₹10 Lakh tak (business expansion ke liye)<br>Aap kisi bhi nationalized bank branch me ya official Udyamimitra portal se direct online apply kar sakte hain!",
        "pmegp": "<strong>PMEGP Subsidy Scheme:</strong><br>Under PMEGP (Prime Minister Employment Generation Programme), central government seedhi margin money subsidy provide karti hai:<br>• <strong>Manufacturing Projects:</strong> ₹50 Lakh tak ka project loan<br>• <strong>Service / Retail Enterprises:</strong> ₹20 Lakh tak ka loan<br>• <strong>Subsidy Percentage:</strong> General category ko Urban me 15% aur Rural me 25%. Special categories (Women, SC/ST, OBC, Minorities) ko Urban me 25% aur <strong>Rural area me 35% tak subsidy</strong> milti hai!",
        "margin": "<strong>Retail Profit Margin Calculation:</strong><br>Profit margin nikaalne ka seedha formula hai:<br><code>((Bikri Mulya - Kharid Mulya) / Bikri Mulya) * 100</code><br>• <strong>Kirana & FMCG Grocery:</strong> 12% se 18% gross margin<br>• <strong>Readymade Garments & Kapda:</strong> 30% se 45% margin<br>• <strong>Cloud Kitchen & Food:</strong> 40% se 60% gross margin<br>Daily kharche monitor karne ke liye aap hamare <strong>Business Health Ledger</strong> me daily sales aur purchase log kar sakte hain!",
        "dpr": "<strong>Bank-Compliant Detailed Project Report (DPR):</strong><br>Bank se loan sanction karane ke liye Detailed Project Report sabse zaroori document hota hai. Isme 5 mukhya sections hone chahiye:<br>1. Promoter Background & Business Profile<br>2. Plant, Machinery & Shop Fit-out Cost<br>3. 3-Mahine ka Working Capital Requirement<br>4. 3-Saal ka Projected Profit & Loss aur Cashflow<br>5. Debt-Equity Ratio & Break-Even Analysis.<br>Aap upar <strong>'View & Download Bank DPR'</strong> button par click karke 1 second me official report print kar sakte hain!",
        "svanidhi": "<strong>PM SVANidhi Scheme:</strong><br>Street vendors aur micro-retailers ke liye collateral-free working capital loan hai. Pehle ₹10,000, samay par repay karne par ₹20,000 aur teesre daur me ₹50,000 tak milta hai. Sath hi regular EMI par <strong>7% interest subsidy</strong> aur digital QR payments par cashback milta hai!",
        "standup": "<strong>Stand-Up India Scheme:</strong><br>SC/ST aur Mahila (Women) entrepreneurs ko nayi manufacturing ya service unit lagane ke liye ₹10 Lakh se ₹1 Crore tak ka greenfield project loan provide kiya jata hai. Isme bank concession rate aur credit guarantee milti hai.",
        "cgtmse": "<strong>CGTMSE Scheme (Collateral-Free Loan):</strong><br>Micro aur Small enterprises ko ₹5 Crore tak ka loan bina kisi third-party guarantee ya property mortgage ke diya jata hai. Iski guarantee trust direct bank ko assurance deti hai.",
        "schemes": "<strong>Bharat Sarkar ki Mukhya MSME Schemes:</strong><br>Hamare platform par sabhi pramukh schemes uplabdh hain:<br>1. <strong>PMEGP:</strong> 15% - 35% Government Subsidy<br>2. <strong>Mudra Loan:</strong> ₹10 Lakh tak collateral-free loan<br>3. <strong>PM SVANidhi:</strong> Micro vendors ke liye ₹50,000 tak working capital<br>4. <strong>Stand-Up India:</strong> Mahila aur SC/ST ke liye ₹1 Crore tak loan<br>5. <strong>CGTMSE:</strong> Zero mortgage guarantee up to ₹5 Crore.<br>Aap upar navigation me <strong>'Govt Schemes'</strong> page par jakar filter aur check kar sakte hain!",
        "profile": "<strong>Enterprise Profile & Scorecard:</strong><br>Aap dedicated <strong>Enterprise Profile Page</strong> par jakar apni investment capacity, business stage, category aur sector save kar sakte hain. Wahan AI readiness score check hoga aur aapke business ke liye best matching schemes filter hokar milengi!",
        "greeting": "Namaste Piyush ji! 🙏 Main aapka Samarth AI Business Saathi hoon. Aap mujhse sarkari schemes, bank DPR report, ya apne business ke expenses & budget manage karne ke baare me Hinglish ya English me kuch bhi pooch sakte hain! Jaise: <em>'Kirana store ka budget plan karo'</em>, <em>'Delivery bike add karo ₹40,000'</em>, ya <em>'Mudra loan kaise milega'</em>",
        "help": "<strong>Main aapki in sabhi cheezon me madad kar sakta hoon:</strong><br>• <strong>Sarkari Schemes:</strong> Mudra, PMEGP, PM SVANidhi aur subsidies ki jankari.<br>• <strong>Capital Allocation & Budgeting:</strong> Apni dukan ya vyapar ka budget plan karna.<br>• <strong>Expense Management:</strong> Naye kharche add karna (jaise bike, CCTV, fridge), balance karna ya badhana/ghatana.<br>• <strong>1-Click Bank DPR:</strong> Bank loan ke liye official project report taiyar karna.<br>Aap Hinglish ya English me jo chahein poochiye!"
    };

    // English Knowledge Base
    const smartResponsesEnglish = {
        "mudra": "<strong>Pradhan Mantri Mudra Yojana (PMMY):</strong><br>Under PMMY, micro-enterprises can access collateral-free institutional credit up to ₹10 Lakhs. It is categorized into:<br>• <strong>Shishu:</strong> Loans up to ₹50,000 (startup phase)<br>• <strong>Kishore:</strong> Loans from ₹50,000 to ₹5 Lakhs (equipment & stock)<br>• <strong>Tarun:</strong> Loans from ₹5 Lakhs to ₹10 Lakhs (expansion phase)<br>You can apply through any scheduled commercial bank or via the official Udyamimitra portal.",
        "pmegp": "<strong>PMEGP Subsidy Scheme:</strong><br>Under the Prime Minister's Employment Generation Programme, the maximum project cost sanctioned is ₹50 Lakhs for manufacturing units and ₹20 Lakhs for service sector enterprises. Eligible entrepreneurs receive a government margin money subsidy between 15% and 35%, significantly reducing the effective repayment burden.",
        "margin": "<strong>Retail Profit Margin Calculation:</strong><br>To calculate retail profit margin, use the formula:<br><code>((Selling Price - Purchase Cost) / Selling Price) * 100</code><br>• <strong>Grocery & FMCG:</strong> Healthy gross margins typically range between 12% and 18%<br>• <strong>Garments & Apparel:</strong> Typically 30% to 45%<br>• <strong>Food Services & Cloud Kitchens:</strong> Typically 40% to 60%<br>Track daily performance automatically in our Business Health Ledger!",
        "dpr": "<strong>Bank-Compliant Detailed Project Report (DPR):</strong><br>A bank-compliant Detailed Project Report (DPR) requires five essential sections: 1. Business Profile & Promoter Background, 2. Plant, Machinery & Infrastructure Setup Cost, 3. 3-Month Working Capital Requirements, 4. 3-Year Projected Profit & Loss Statement, and 5. Break-Even Analysis. Click the 'View & Download Bank DPR' button in the Fund Planner section to export this report in 1 click!",
        "svanidhi": "<strong>PM SVANidhi Scheme:</strong><br>A micro-credit facility providing street vendors and nano-retailers with working capital loans starting at ₹10,000, scaling to ₹20,000 and ₹50,000 upon timely repayment. It includes an attractive 7% interest subsidy rebate and monthly digital transaction cashback incentives.",
        "standup": "<strong>Stand-Up India Scheme:</strong><br>Facilitates bank loans between ₹10 Lakhs and ₹1 Crore to at least one Scheduled Caste (SC) or Scheduled Tribe (ST) borrower and at least one woman borrower per bank branch for setting up greenfield enterprises.",
        "cgtmse": "<strong>CGTMSE Collateral-Free Credit Scheme:</strong><br>Provides credit guarantee coverage up to ₹5 Crores for micro and small enterprises without requiring third-party guarantee or immovable property collateral.",
        "schemes": "<strong>Government Schemes Overview:</strong><br>Key Indian schemes supported on this platform include:<br>• <strong>PMEGP:</strong> 15% - 35% capital subsidy<br>• <strong>Mudra Loan:</strong> Collateral-free up to ₹10 Lakhs<br>• <strong>PM SVANidhi:</strong> Nano working capital up to ₹50,000<br>• <strong>Stand-Up India:</strong> Greenfield funding up to ₹1 Crore<br>• <strong>CGTMSE:</strong> Zero mortgage guarantee up to ₹5 Crores.<br>Explore all programs on our dedicated Schemes page!",
        "profile": "<strong>Enterprise Profile & Scorecard:</strong><br>Complete your enterprise profile on the Profile page to evaluate your MSME Readiness Score and unlock tailor-made government subsidy recommendations.",
        "greeting": "Hello Piyush ji! 👋 I am your Samarth AI Business Advisor. You can ask me about government schemes, bank DPR requirements, or tell me your business idea so I can customize your capital budget in English or Hinglish!",
        "help": "<strong>I can help you with:</strong><br>• <strong>Government Schemes:</strong> Mudra, PMEGP, PM SVANidhi, Stand-Up India.<br>• <strong>Capital Allocation & Budgeting:</strong> Planning business setup funds.<br>• <strong>Expense Management:</strong> Adding custom expenses, auto-balancing, or adjusting percentages.<br>• <strong>1-Click Bank DPR Report:</strong> Generating an official project report for bank loans."
    };

    // Language Toggle Event Listeners
    function setAiLanguage(lang, notify = true) {
        currentAiLanguage = lang;
        localStorage.setItem("samarth_ai_lang", lang);

        document.querySelectorAll(".ai-lang-btn").forEach(btn => {
            if (btn.getAttribute("data-lang") === lang) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });

        if (notify) {
            if (lang === "hinglish") {
                appendMessage("🙏 <strong>Language: Hinglish active.</strong> Ab main aapse aam bolchal ki Hinglish me baat karunga. Aap sarkari schemes, bank loans aur expenses ke baare me bejhijhak pooch sakte hain!", "bot");
                showToast("AI Language set to Hinglish", "fa-language");
            } else {
                appendMessage("🌐 <strong>Language: English active.</strong> Switched to English mode. You can now ask questions about schemes, DPR reports, and capital management in English.", "bot");
                showToast("AI Language set to English", "fa-globe");
            }
        }
    }

    document.querySelectorAll(".ai-lang-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const lang = this.getAttribute("data-lang");
            setAiLanguage(lang, true);
        });
    });

    // Initialize Language Toggle State
    setAiLanguage(currentAiLanguage, false);

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
            const q = query.toLowerCase().trim();
            const isHinglish = currentAiLanguage === "hinglish" || detectHinglish(query);

            // 1. First check if user is asking to manage, customize, or plan expenses
            const expenseResult = handleAiExpenseCommand(query, { isChatbot: true });
            if (expenseResult && expenseResult.handled) {
                const total = (parseFloat(loanRange?.value) || 0) + (parseFloat(savingsRange?.value) || 0);
                const totalPctSum = Math.round(activeAllocationConfig.reduce((sum, item) => sum + item.pct, 0) * 100);

                const viewBtnText = isHinglish
                    ? '<i class="fa-solid fa-chart-pie"></i> Live Allocation Breakdown Dekhein'
                    : '<i class="fa-solid fa-chart-pie"></i> View Live Allocation Breakdown';

                const totalCapLabel = isHinglish ? "Total Capital:" : "Total Capital:";
                const activeCatLabel = isHinglish ? "Active Categories:" : "Active Categories:";
                const allocStatLabel = isHinglish ? "Allocation Status:" : "Allocation Status:";
                const balancedText = isHinglish ? `${totalPctSum}% Balanced` : `${totalPctSum}% Balanced`;

                let chatResponseHtml = `
                    <div style="margin-bottom: 6px;">${expenseResult.message}</div>
                    <div class="chat-expense-card">
                        <div class="chat-expense-row">
                            <span><strong>${totalCapLabel}</strong></span>
                            <span>${formatINR(total)}</span>
                        </div>
                        <div class="chat-expense-row">
                            <span><strong>${activeCatLabel}</strong></span>
                            <span>${activeAllocationConfig.length} items</span>
                        </div>
                        <div class="chat-expense-row">
                            <span><strong>${allocStatLabel}</strong></span>
                            <span style="color: #059669; font-weight: bold;"><i class="fa-solid fa-circle-check"></i> ${balancedText}</span>
                        </div>
                    </div>
                    <button type="button" class="chat-action-btn" onclick="scrollToAllocation()">
                        ${viewBtnText}
                    </button>
                `;

                appendMessage(chatResponseHtml, "bot");
                showToast(isHinglish ? "Capital Allocation AI dwara update ho gaya!" : "Capital Allocation Breakdown updated via AI!", "fa-circle-check");
                return;
            }

            // 2. Bilingual Knowledge Base Matching
            const kb = isHinglish ? smartResponsesHinglish : smartResponsesEnglish;
            let matchedReply = null;

            if (q.includes("namaste") || q.includes("pranam") || q.includes("hello") || q.includes("hi ") || q === "hi" || q.includes("hey") || q.includes("kaise ho")) {
                matchedReply = kb["greeting"];
            } else if (q.includes("mudra") || q.includes("pmmy") || q.includes("shishu") || q.includes("kishore") || q.includes("tarun")) {
                matchedReply = kb["mudra"];
            } else if (q.includes("pmegp") || q.includes("subsidy") || q.includes("margin money")) {
                matchedReply = kb["pmegp"];
            } else if (q.includes("svanidhi") || q.includes("street vendor") || q.includes("thela") || q.includes("rehdi") || q.includes("vendor")) {
                matchedReply = kb["svanidhi"];
            } else if (q.includes("stand up") || q.includes("standup") || q.includes("mahila") || (q.includes("women") && q.includes("loan"))) {
                matchedReply = kb["standup"];
            } else if (q.includes("cgtmse") || q.includes("guarantee") || q.includes("without collateral")) {
                matchedReply = kb["cgtmse"];
            } else if (q.includes("margin") || q.includes("profit") || q.includes("munafa") || q.includes("markup") || q.includes("kamai")) {
                matchedReply = kb["margin"];
            } else if (q.includes("dpr") || q.includes("bank report") || q.includes("project report") || q.includes("loan file")) {
                matchedReply = kb["dpr"];
            } else if (q.includes("scheme") || q.includes("yojana") || q.includes("yojna") || q.includes("sarkari") || q.includes("list")) {
                matchedReply = kb["schemes"];
            } else if (q.includes("profile") || q.includes("score") || q.includes("scorecard") || q.includes("eligibility") || q.includes("patrata")) {
                matchedReply = kb["profile"];
            } else if (q.includes("help") || q.includes("madad") || q.includes("kya kar sakte") || q.includes("features") || q.includes("guide")) {
                matchedReply = kb["help"];
            } else {
                matchedReply = isHinglish
                    ? "Yeh ek bohot badhiya sawal hai! Iske baare me vistrit jaankari ke liye aap pehle hamare <strong>Profile Page</strong> par jakar apni business details fill karein taaki hum exact subsidy calculate kar sakein. Ya phir aap mujhse schemes (Mudra, PMEGP), bank DPR, ya budget expenses (jaise: <em>'Stock 40% karo'</em>, <em>'Delivery bike add karo ₹40,000'</em>) ke baare me pooch sakte hain!"
                    : "That is a great question! For detailed analysis, we recommend completing your Profile details first to evaluate exact subsidy eligibility. You can also tell me to customize your expenses (e.g. <em>'Add delivery bike ₹40k'</em>, <em>'Increase stock to 40%'</em>) or ask about Mudra/PMEGP loan rules.";
            }

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
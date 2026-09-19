/**
 * Rocky Studio Art - JavaScript Principal
 * Sublimação, Estamparia & Personalizados
 */

// ==========================================
// Configurações Globais (Altere aqui seu número)
// ==========================================
const CONFIG = {
    // Digite o número do WhatsApp com DDI (55) + DDD + Número, apenas dígitos:
    whatsappNumber: '5541988506018',
    storeName: 'Rocky Studio Art'
};

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCategoryFilters();
    initBudgetCalculator();
    initContactForm();
    initSmoothScrollAndActiveNav();
    updateWhatsAppLinks();
});

/**
 * Atualiza todos os links do WhatsApp na página com o número da constante CONFIG
 */
function updateWhatsAppLinks() {
    const defaultLinks = document.querySelectorAll('a[href*="wa.me"]');
    defaultLinks.forEach(link => {
        const currentHref = link.getAttribute('href');
        // Mantém a query string do texto caso exista
        if (currentHref.includes('?text=')) {
            const parts = currentHref.split('?text=');
            link.setAttribute('href', `https://wa.me/${CONFIG.whatsappNumber}?text=${parts[1]}`);
        } else {
            link.setAttribute('href', `https://wa.me/${CONFIG.whatsappNumber}`);
        }
    });
}

/**
 * Menu Mobile (Drawer e Hambúrguer)
 */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const drawer = document.getElementById('mobile-drawer');
    const links = document.querySelectorAll('.mobile-link');

    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = drawer.classList.contains('is-open');
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fechar ao clicar em qualquer link
    links.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('is-open')) {
            closeMenu();
        }
    });

    function openMenu() {
        drawer.classList.add('is-open');
        toggleBtn.classList.add('is-open');
        toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        drawer.classList.remove('is-open');
        toggleBtn.classList.remove('is-open');
        toggleBtn.setAttribute('aria-expanded', 'false');
    }
}

/**
 * Filtro de Categorias de Produtos
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (!filterButtons.length || !productCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Atualiza classe active
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (filterValue === 'todos' || cardCat === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/**
 * Calculadora Interativa de Orçamento com Desconto por Volume
 */
function initBudgetCalculator() {
    const productSelect = document.getElementById('calc-product');
    const qtyRange = document.getElementById('calc-qty-range');
    const qtyDisplay = document.getElementById('qty-display');
    const quickQtyBtns = document.querySelectorAll('.btn-qty');
    const artRadios = document.querySelectorAll('input[name="calc-art"]');

    // Elementos de Resumo
    const summaryProductName = document.getElementById('summary-product-name');
    const summaryQty = document.getElementById('summary-qty');
    const summaryUnitPrice = document.getElementById('summary-unit-price');
    const summaryDiscount = document.getElementById('summary-discount');
    const discountRow = document.getElementById('discount-row');
    const summaryTotal = document.getElementById('summary-total');
    const btnCalcWhatsApp = document.getElementById('btn-calc-whatsapp');

    if (!productSelect || !qtyRange) return;

    function formatBRL(val) {
        return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calculate() {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const basePrice = parseFloat(selectedOption.getAttribute('data-price')) || 35.00;
        const productName = selectedOption.text.split('(')[0].trim();
        const qty = parseInt(qtyRange.value, 10);

        // Atualiza textos
        qtyDisplay.textContent = `${qty} ${qty > 1 ? 'unidades' : 'unidade'}`;
        summaryProductName.textContent = productName;
        summaryQty.textContent = `${qty} ${qty > 1 ? 'unidades' : 'unidade'}`;
        summaryUnitPrice.textContent = formatBRL(basePrice);

        // Desconto Progressivo por Volume
        let discountPercent = 0;
        if (qty >= 50) {
            discountPercent = 20; // 20% para 50+
        } else if (qty >= 25) {
            discountPercent = 15; // 15% para 25-49
        } else if (qty >= 10) {
            discountPercent = 10; // 10% para 10-24
        } else if (qty >= 5) {
            discountPercent = 5;  // 5% para 5-9
        }

        const subtotal = basePrice * qty;
        const discountAmount = subtotal * (discountPercent / 100);
        const finalTotal = subtotal - discountAmount;

        // Exibe ou oculta linha de desconto
        if (discountPercent > 0) {
            discountRow.style.display = 'flex';
            summaryDiscount.textContent = `- ${formatBRL(discountAmount)} (${discountPercent}%)`;
        } else {
            discountRow.style.display = 'none';
        }

        summaryTotal.textContent = formatBRL(finalTotal);

        // Situação da arte
        let artText = 'Já possuo a arte / foto pronta';
        artRadios.forEach(radio => {
            if (radio.checked && radio.value === 'ajustar') {
                artText = 'Preciso de criação / ajuste de arte pelo estúdio';
            }
        });

        // Monta mensagem codificada para o WhatsApp
        const message = 
            `*Olá! Gostaria de um orçamento pelo simulador do site Rocky Studio Art:*\n\n` +
            `📦 *Produto:* ${productName}\n` +
            `🔢 *Quantidade:* ${qty} un.\n` +
            `🏷️ *Preço Unitário Base:* ${formatBRL(basePrice)}\n` +
            (discountPercent > 0 ? `🎉 *Desconto Atacado (${discountPercent}%):* - ${formatBRL(discountAmount)}\n` : '') +
            `💰 *Total Estimado:* ${formatBRL(finalTotal)}\n` +
            `🎨 *Situação da Arte:* ${artText}\n\n` +
            `Poderia me confirmar a disponibilidade e prazo de entrega?`;

        btnCalcWhatsApp.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    }

    // Eventos
    productSelect.addEventListener('change', calculate);
    qtyRange.addEventListener('input', calculate);

    quickQtyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = parseInt(btn.getAttribute('data-val'), 10);
            qtyRange.value = val;
            calculate();
        });
    });

    artRadios.forEach(radio => {
        radio.addEventListener('change', calculate);
    });

    // Cálculo inicial
    calculate();
}

/**
 * Formulário de Contato Rápido
 */
function initContactForm() {
    const form = document.getElementById('quick-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('contact-name').value.trim();
        const product = document.getElementById('contact-product').value;
        const msg = document.getElementById('contact-msg').value.trim();

        if (!name || !msg) {
            alert('Por favor, preencha seu nome e sua mensagem.');
            return;
        }

        const fullMessage = 
            `*Olá! Mensagem rápida enviada pelo site Rocky Studio Art:*\n\n` +
            `👤 *Nome:* ${name}\n` +
            `🎁 *Produto de Interesse:* ${product}\n` +
            `💬 *Mensagem/Ideia:* ${msg}`;

        const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
        window.open(whatsappUrl, '_blank');
    });
}

/**
 * Rolagem Suave e Indicador Ativo no Menu de Navegação
 */
function initSmoothScrollAndActiveNav() {
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

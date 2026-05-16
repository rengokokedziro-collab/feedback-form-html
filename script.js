"use strict";

// ========== ПОЛУЧАЕМ ВСЕ НЕОБХОДИМЫЕ DOM-ЭЛЕМЕНТЫ ==========
const form = document.getElementById('feedbackForm');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const commentInput = document.getElementById('commentInput');

// Контейнеры для ошибок
const nameErrorDiv = document.getElementById('nameError');
const emailErrorDiv = document.getElementById('emailError');
const commentErrorDiv = document.getElementById('commentError');

// Контейнер для приветствия
const welcomeContainer = document.getElementById('welcomeMessageContainer');

// ========== ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ОЧИСТКИ ОШИБОК ==========
function clearErrors() {
    nameErrorDiv.innerHTML = '';
    emailErrorDiv.innerHTML = '';
    commentErrorDiv.innerHTML = '';
    
    // Убираем класс ошибки с полей
    nameInput.classList.remove('error-field');
    emailInput.classList.remove('error-field');
    commentInput.classList.remove('error-field');
    
    // Сбрасываем border (на случай, если класс не сработал)
    nameInput.style.borderColor = '';
    emailInput.style.borderColor = '';
    commentInput.style.borderColor = '';
}

// ========== ФУНКЦИЯ ДЛЯ ОТОБРАЖЕНИЯ ОШИБКИ У КОНКРЕТНОГО ПОЛЯ ==========
function setFieldError(field, errorDiv, message) {
    if (message) {
        errorDiv.innerHTML = message;
        field.classList.add('error-field');
    } else {
        errorDiv.innerHTML = '';
        field.classList.remove('error-field');
    }
}

// ========== ВАЛИДАЦИЯ EMAIL (РАСШИРЕННАЯ) ==========
function isValidEmail(email) {
    if (!email || typeof email !== 'string') return false;
    
    // Полностью соответствующая стандартам регулярка для email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const trimmed = email.trim();
    if (trimmed !== email) return false;
    
    // Дополнительная проверка на недопустимые последовательности
    if (email.includes('..') || email.includes('@.') || email.startsWith('.') || email.endsWith('.')) {
        return false;
    }
    
    return emailRegex.test(trimmed);
}

// ========== ФУНКЦИЯ ДЛЯ БЕЗОПАСНОГО ЭКРАНИРОВАНИЯ HTML ==========
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== ГЛАВНАЯ ФУНКЦИЯ: ПРОВЕРКА И СОЗДАНИЕ ПРИВЕТСТВИЯ ==========
function validateAndGreet(event) {
    event.preventDefault();  // Останавливаем отправку формы и перезагрузку страницы
    
    // 1. Очищаем прошлые ошибки и скрываем старое приветствие
    clearErrors();
    welcomeContainer.classList.add('hidden');
    welcomeContainer.innerHTML = '';
    
    // 2. Получаем значения и обрезаем пробелы
    let nameValue = nameInput.value.trim();
    let emailValue = emailInput.value.trim();
    let commentValue = commentInput.value.trim();
    
    let hasErrors = false;
    
    // ---------- ПРОВЕРКА ИМЕНИ ----------
    if (nameValue === "") {
        setFieldError(nameInput, nameErrorDiv, "❌ Имя не может быть пустым.");
        hasErrors = true;
    } else if (nameValue.length < 2) {
        setFieldError(nameInput, nameErrorDiv, "❌ Имя должно содержать минимум 2 символа.");
        hasErrors = true;
    } else if (nameValue.length > 50) {
        setFieldError(nameInput, nameErrorDiv, "❌ Имя слишком длинное (максимум 50 символов).");
        hasErrors = true;
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s\-'.]+$/.test(nameValue)) {
        setFieldError(nameInput, nameErrorDiv, "❌ Используйте только буквы, пробелы, дефис или апостроф.");
        hasErrors = true;
    }
    
    // ---------- ПРОВЕРКА EMAIL ----------
    if (emailValue === "") {
        setFieldError(emailInput, emailErrorDiv, "❌ Email не может быть пустым.");
        hasErrors = true;
    } else if (!isValidEmail(emailValue)) {
        setFieldError(emailInput, emailErrorDiv, "❌ Введите корректный email (пример: name@domain.com)");
        hasErrors = true;
    }
    
    // ---------- ПРОВЕРКА КОММЕНТАРИЯ ----------
    if (commentValue === "") {
        setFieldError(commentInput, commentErrorDiv, "❌ Комментарий не может быть пустым.");
        hasErrors = true;
    } else if (commentValue.length < 3) {
        setFieldError(commentInput, commentErrorDiv, "❌ Комментарий слишком короткий (минимум 3 символа).");
        hasErrors = true;
    } else if (commentValue.length > 800) {
        setFieldError(commentInput, commentErrorDiv, "❌ Комментарий не должен превышать 800 символов.");
        hasErrors = true;
    }
    
    // ---------- ЕСЛИ ЕСТЬ ОШИБКИ — ПРЕРЫВАЕМ ВЫПОЛНЕНИЕ ----------
    if (hasErrors) {
        // Плавно скроллим к первой ошибке
        const firstErrorField = document.querySelector('.error-field');
        if (firstErrorField) {
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
    }
    
    // ---------- ВСЕ ПОЛЯ ПРОШЛИ ВАЛИДАЦИЮ → СОЗДАЁМ ПРИВЕТСТВИЕ ----------
    const greetingDiv = document.createElement('div');
    greetingDiv.className = 'welcome-card';
    
    // Заголовок приветствия
    const titleGreet = document.createElement('p');
    titleGreet.style.fontWeight = 'bold';
    titleGreet.style.fontSize = '1.1rem';
    titleGreet.style.marginBottom = '0.75rem';
    titleGreet.innerHTML = `✨ Здравствуйте, <strong>${escapeHtml(nameValue)}</strong>! ✨`;
    greetingDiv.appendChild(titleGreet);
    
    // Блок с email
    const emailLine = document.createElement('p');
    emailLine.innerHTML = `📧 <strong>Email:</strong> ${escapeHtml(emailValue)}`;
    greetingDiv.appendChild(emailLine);
    
    // Блок с комментарием
    const commentLine = document.createElement('p');
    commentLine.innerHTML = `💬 <strong>Ваш комментарий:</strong> «${escapeHtml(commentValue)}»`;
    greetingDiv.appendChild(commentLine);
    
    // Благодарность
    const thanksLine = document.createElement('p');
    thanksLine.style.marginTop = '0.75rem';
    thanksLine.style.fontStyle = 'italic';
    thanksLine.style.color = '#1b5e20';
    thanksLine.style.fontWeight = '500';
    thanksLine.textContent = 'Спасибо за обращение! Мы свяжемся с вами в ближайшее время.';
    greetingDiv.appendChild(thanksLine);
    
    welcomeContainer.appendChild(greetingDiv);
    welcomeContainer.classList.remove('hidden');
    
    // Плавная прокрутка к приветствию
    welcomeContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== ЖИВАЯ ВАЛИДАЦИЯ (УБИРАЕМ ОШИБКУ ПРИ ВВОДЕ) ==========
function setupLiveValidation() {
    const clearFieldError = (field, errorDiv) => {
        field.addEventListener('input', () => {
            setFieldError(field, errorDiv, '');
        });
        field.addEventListener('focus', () => {
            setFieldError(field, errorDiv, '');
        });
    };
    
    clearFieldError(nameInput, nameErrorDiv);
    clearFieldError(emailInput, emailErrorDiv);
    clearFieldError(commentInput, commentErrorDiv);
}

// ========== ИНИЦИАЛИЗАЦИЯ: НАВЕШИВАЕМ ОБРАБОТЧИКИ ==========
form.addEventListener('submit', validateAndGreet);
setupLiveValidation();

// Устанавливаем фокус на поле имени при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    nameInput.focus();
});

// ========== ДОПОЛНИТЕЛЬНО: КНОПКА ENTER НЕ ВЫЗЫВАЕТ НЕЖЕЛАТНЫХ ДЕЙСТВИЙ ==========
// Всё уже корректно обрабатывается через событие submit формы
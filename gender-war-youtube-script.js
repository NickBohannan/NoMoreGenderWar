// ==UserScript==
// @name         YouTube Gender-War Filter
// @namespace    http://tampermonkey.net
// @version      2.2
// @description  Hides YouTube video cards matching configurable gender-war terms
// @author       Nick Bohannan
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    const blockedPhrases = [
        'gender',
        'genders',
        'gendered',
        'sexism',
        'sexist',
        'sexists',
        'male',
        'males',
        'female',
        'females',
        'man',
        'men',
        'woman',
        'women',
        'boy',
        'boys',
        'girl',
        'girls',
        'men vs women',
        'women vs men',
        'battle of the sexes',
        'gender war',
        'gender wars',
        'gender debate',
        'gender politics',
        'gender ideology',
        'gender equality',
        'gender roles',
        'gender norms',
        'gender studies',
        'gender divide',
        'gender gap',
        'gender pay gap',
        'gender relations',
        'sex differences',
        'war on men',
        'war on women',
        'dating war',
        'dating advice',
        'dating coach',
        'dating coaches',
        'dating culture',
        'dating market',
        'dating scene',
        'relationship advice',
        'relationship coach',
        'relationship coaches',
        'relationship dynamics',
        'modern dating',
        'why men',
        'why women',
        'men are',
        'women are',
        'feminism',
        'feminist',
        'feminists',
        'feminism destroyed',
        'feminist destroyed',
        'anti-feminist',
        'anti feminist',
        'patriarchy',
        'patriarchal',
        'matriarchy',
        'matriarchal',
        'misogyny',
        'misogynist',
        'misandry',
        'misandrist',
        'mens rights',
        "men's rights",
        'mens rights activist',
        'mra',
        'female empowerment',
        'women empowerment',
        'women rights',
        "women's rights",
        'toxic masculinity',
        'toxic femininity',
        'masculinity',
        'femininity',
        'traditional masculinity',
        'traditional femininity',
        'fragile masculinity',
        'male loneliness',
        'male privilege',
        'female privilege',
        'red pill',
        'redpilled',
        'black pill',
        'blue pill',
        'mgtow',
        'incel',
        'involuntary celibate',
        'looksmaxxing',
        'hypergamy',
        'passport bro',
        'passport bros',
        'tradwife',
        'trad wife',
        'pick me',
        'pickme',
        'alpha male',
        'sigma male',
        'beta male',
        'chad',
        'simp',
        'simping',
        'high value men',
        'high value man',
        'high value women',
        'high value woman',
        'modern women',
        'modern men',
        'women today',
        'men today',
        'female nature',
        'male nature',
        'female psychology',
        'male psychology',
        'female behavior',
        'male behavior',
        'body count',
        'onlyfans',
        'divorce court',
        'family court',
        'paternity fraud',
        'false accusation',
        'false accusations',
        'metoo',
        'me too',
        'culture war',
        'woke',
        'dei',
        'affirmative action'
    ];
    const videoSelector = [
        'ytd-rich-item-renderer',
        'ytd-video-renderer',
        'ytd-compact-video-renderer',
        'ytd-grid-video-renderer',
        'ytd-rich-grid-media',
        'ytd-rich-grid-slim-media',
        'ytd-reel-item-renderer',
        'yt-lockup-view-model'
    ].join(', ');

    function escapeRegExp(value) {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const blockedPattern = new RegExp(
        `\\b(?:${blockedPhrases.map(escapeRegExp).join('|')})\\b`,
        'i'
    );

    function filterVideos() {
        const videoElements = document.querySelectorAll(videoSelector);

        videoElements.forEach(video => {
            if (video.dataset.genderWarFiltered) {
                return;
            }

            const title = video.querySelector([
                '#video-title',
                '#video-title-link',
                'yt-formatted-string#video-title',
                'a[title][href*="/watch"]',
                'a[aria-label][href*="/watch"]'
            ].join(', '));
            const description = video.querySelector('#description-text, #description, yt-formatted-string#description-text');
            const visibleText = [title, description]
                .filter(Boolean)
                .map(element => `${element.textContent || ''} ${element.getAttribute('title') || ''}`)
                .join(' ')
                .trim();

            if (blockedPattern.test(visibleText)) {
                video.dataset.genderWarFiltered = 'true';
                video.style.display = 'none';
            }
        });
    }

    // Continuously scan for dynamically loaded video grids as you scroll
    let scanQueued = false;
    const observer = new MutationObserver(() => {
        if (!scanQueued) {
            scanQueued = true;
            requestAnimationFrame(() => {
                scanQueued = false;
                filterVideos();
            });
        }
    });

    const config = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ['title', 'aria-label']
    };
    const checkExist = setInterval(() => {
        if (document.body) {
            clearInterval(checkExist);
            observer.observe(document.body, config);
            filterVideos();
        }
    }, 100);
})();

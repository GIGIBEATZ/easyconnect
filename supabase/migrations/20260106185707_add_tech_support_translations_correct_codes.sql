/*
  # Add Tech Support Translations (Correct Language Codes)
  
  1. Translation Keys
    - Tech support specific terminology in 12 major languages
    
  2. Languages Supported
    - English, Spanish, French, German, Chinese (Simplified), Japanese
    - Arabic, Hindi, Portuguese, Russian, Korean, Italian
*/

-- Insert translation keys for tech support
INSERT INTO translation_keys (key, namespace, context) VALUES
  ('site.name', 'branding', 'Website name'),
  ('site.tagline', 'branding', 'Website tagline'),
  ('nav.services', 'navigation', 'Services menu item'),
  ('nav.support', 'navigation', 'Support menu item'),
  ('nav.tickets', 'navigation', 'Tickets menu item'),
  ('nav.knowledge_base', 'navigation', 'Knowledge base menu item'),
  ('nav.my_tickets', 'navigation', 'My tickets menu item'),
  ('nav.create_ticket', 'navigation', 'Create ticket button'),
  ('hero.title', 'homepage', 'Hero section title'),
  ('hero.subtitle', 'homepage', 'Hero section subtitle'),
  ('hero.cta', 'homepage', 'Hero call to action button')
ON CONFLICT (key) DO NOTHING;

-- Get translation key IDs for inserting translations
DO $$
DECLARE
  key_id UUID;
BEGIN
  -- Site name translations (12 languages)
  SELECT id INTO key_id FROM translation_keys WHERE key = 'site.name';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'TechSupport Global'),
      (key_id, 'es', 'Soporte Técnico Global'),
      (key_id, 'fr', 'Support Technique Global'),
      (key_id, 'de', 'Technischer Support Global'),
      (key_id, 'zh-CN', '全球技术支持'),
      (key_id, 'ja', 'グローバルテックサポート'),
      (key_id, 'ar', 'الدعم التقني العالمي'),
      (key_id, 'hi', 'टेकसपोर्ट ग्लोबल'),
      (key_id, 'pt', 'Suporte Técnico Global'),
      (key_id, 'ru', 'Техподдержка Глобал'),
      (key_id, 'ko', '글로벌 기술 지원'),
      (key_id, 'it', 'Supporto Tecnico Globale')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Site tagline translations
  SELECT id INTO key_id FROM translation_keys WHERE key = 'site.tagline';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Expert Tech Support, Anytime, Anywhere'),
      (key_id, 'es', 'Soporte Técnico Experto, En Cualquier Momento, En Cualquier Lugar'),
      (key_id, 'fr', 'Support Technique Expert, N''importe Quand, N''importe Où'),
      (key_id, 'de', 'Experten-Technikunterstützung, Jederzeit, Überall'),
      (key_id, 'zh-CN', '专业技术支持，随时随地'),
      (key_id, 'ja', '専門技術サポート、いつでもどこでも'),
      (key_id, 'ar', 'دعم تقني احترافي، في أي وقت وأي مكان'),
      (key_id, 'hi', 'विशेषज्ञ तकनीकी सहायता, किसी भी समय, कहीं भी'),
      (key_id, 'pt', 'Suporte Técnico Especializado, A Qualquer Hora, Em Qualquer Lugar'),
      (key_id, 'ru', 'Экспертная техподдержка, в любое время, в любом месте'),
      (key_id, 'ko', '전문 기술 지원, 언제 어디서나'),
      (key_id, 'it', 'Supporto Tecnico Esperto, Sempre, Ovunque')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Navigation: Services
  SELECT id INTO key_id FROM translation_keys WHERE key = 'nav.services';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Services'),
      (key_id, 'es', 'Servicios'),
      (key_id, 'fr', 'Services'),
      (key_id, 'de', 'Dienstleistungen'),
      (key_id, 'zh-CN', '服务'),
      (key_id, 'ja', 'サービス'),
      (key_id, 'ar', 'خدمات'),
      (key_id, 'hi', 'सेवाएं'),
      (key_id, 'pt', 'Serviços'),
      (key_id, 'ru', 'Услуги'),
      (key_id, 'ko', '서비스'),
      (key_id, 'it', 'Servizi')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Navigation: Support
  SELECT id INTO key_id FROM translation_keys WHERE key = 'nav.support';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Support'),
      (key_id, 'es', 'Soporte'),
      (key_id, 'fr', 'Assistance'),
      (key_id, 'de', 'Unterstützung'),
      (key_id, 'zh-CN', '支持'),
      (key_id, 'ja', 'サポート'),
      (key_id, 'ar', 'الدعم'),
      (key_id, 'hi', 'सहायता'),
      (key_id, 'pt', 'Suporte'),
      (key_id, 'ru', 'Поддержка'),
      (key_id, 'ko', '지원'),
      (key_id, 'it', 'Supporto')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Navigation: Tickets
  SELECT id INTO key_id FROM translation_keys WHERE key = 'nav.tickets';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Tickets'),
      (key_id, 'es', 'Tickets'),
      (key_id, 'fr', 'Tickets'),
      (key_id, 'de', 'Tickets'),
      (key_id, 'zh-CN', '工单'),
      (key_id, 'ja', 'チケット'),
      (key_id, 'ar', 'التذاكر'),
      (key_id, 'hi', 'टिकट'),
      (key_id, 'pt', 'Tickets'),
      (key_id, 'ru', 'Заявки'),
      (key_id, 'ko', '티켓'),
      (key_id, 'it', 'Ticket')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Navigation: Knowledge Base
  SELECT id INTO key_id FROM translation_keys WHERE key = 'nav.knowledge_base';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Knowledge Base'),
      (key_id, 'es', 'Base de Conocimientos'),
      (key_id, 'fr', 'Base de Connaissances'),
      (key_id, 'de', 'Wissensdatenbank'),
      (key_id, 'zh-CN', '知识库'),
      (key_id, 'ja', 'ナレッジベース'),
      (key_id, 'ar', 'قاعدة المعرفة'),
      (key_id, 'hi', 'ज्ञान आधार'),
      (key_id, 'pt', 'Base de Conhecimento'),
      (key_id, 'ru', 'База знаний'),
      (key_id, 'ko', '지식 베이스'),
      (key_id, 'it', 'Base di Conoscenza')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Hero section title
  SELECT id INTO key_id FROM translation_keys WHERE key = 'hero.title';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Get Expert Tech Support'),
      (key_id, 'es', 'Obtén Soporte Técnico Experto'),
      (key_id, 'fr', 'Obtenez un Support Technique Expert'),
      (key_id, 'de', 'Holen Sie sich Experten-Technikunterstützung'),
      (key_id, 'zh-CN', '获取专业技术支持'),
      (key_id, 'ja', '専門家による技術サポート'),
      (key_id, 'ar', 'احصل على دعم تقني احترافي'),
      (key_id, 'hi', 'विशेषज्ञ तकनीकी सहायता प्राप्त करें'),
      (key_id, 'pt', 'Obtenha Suporte Técnico Especializado'),
      (key_id, 'ru', 'Получите экспертную техподдержку'),
      (key_id, 'ko', '전문 기술 지원 받기'),
      (key_id, 'it', 'Ottieni Supporto Tecnico Esperto')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Hero section subtitle
  SELECT id INTO key_id FROM translation_keys WHERE key = 'hero.subtitle';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', '24/7 technical support in your language. Hardware, software, network solutions and more.'),
      (key_id, 'es', 'Soporte técnico 24/7 en tu idioma. Hardware, software, soluciones de red y más.'),
      (key_id, 'fr', 'Support technique 24h/24 et 7j/7 dans votre langue. Matériel, logiciels, solutions réseau et plus.'),
      (key_id, 'de', '24/7-Technischer Support in Ihrer Sprache. Hardware, Software, Netzwerklösungen und mehr.'),
      (key_id, 'zh-CN', '24/7 技术支持，使用您的语言。硬件、软件、网络解决方案等。'),
      (key_id, 'ja', 'あなたの言語で24時間年中無休の技術サポート。ハードウェア、ソフトウェア、ネットワークソリューションなど。'),
      (key_id, 'ar', 'دعم تقني على مدار الساعة بلغتك. الأجهزة والبرمجيات وحلول الشبكات والمزيد.'),
      (key_id, 'hi', 'आपकी भाषा में 24/7 तकनीकी सहायता। हार्डवेयर, सॉफ्टवेयर, नेटवर्क समाधान और अधिक।'),
      (key_id, 'pt', 'Suporte técnico 24 horas por dia, 7 dias por semana, no seu idioma. Hardware, software, soluções de rede e muito mais.'),
      (key_id, 'ru', 'Круглосуточная техническая поддержка на вашем языке. Аппаратное и программное обеспечение, сетевые решения и многое другое.'),
      (key_id, 'ko', '귀하의 언어로 24시간 연중무휴 기술 지원. 하드웨어, 소프트웨어, 네트워크 솔루션 등.'),
      (key_id, 'it', 'Supporto tecnico 24 ore su 24, 7 giorni su 7 nella tua lingua. Hardware, software, soluzioni di rete e altro ancora.')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Hero CTA button
  SELECT id INTO key_id FROM translation_keys WHERE key = 'hero.cta';
  IF key_id IS NOT NULL THEN
    INSERT INTO translations (key_id, language_code, value) VALUES
      (key_id, 'en', 'Get Support Now'),
      (key_id, 'es', 'Obtener Soporte Ahora'),
      (key_id, 'fr', 'Obtenir de l''aide maintenant'),
      (key_id, 'de', 'Jetzt Unterstützung erhalten'),
      (key_id, 'zh-CN', '立即获取支持'),
      (key_id, 'ja', '今すぐサポートを受ける'),
      (key_id, 'ar', 'احصل على الدعم الآن'),
      (key_id, 'hi', 'अभी सहायता प्राप्त करें'),
      (key_id, 'pt', 'Obtenha Suporte Agora'),
      (key_id, 'ru', 'Получить поддержку сейчас'),
      (key_id, 'ko', '지금 지원 받기'),
      (key_id, 'it', 'Ottieni supporto ora')
    ON CONFLICT DO NOTHING;
  END IF;
  
END $$;
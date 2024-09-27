# Смена названия пакета
При релизе будет изменено название пакета, потребуется так же скорректировать данные и в примере.

Места к изменению в рамках самого пакета:
- tsconfig.json - rn-neti-mobile-image-viewing
- README.md - rn-neti-mobile-image-viewing
- package.json - rn-neti-mobile-image-viewing, rn-neti-mobile-image-viewing-example. При необходимости обратить внимание
на название репозитория NETI-MOBILE (во всех местах использования) и адрес электронной почты автора.
- LICENSE - Neti.Mobile

Места к изменению в рамках примера:
- package.json - rn-neti-mobile-image-viewing-example
- app.json - rn-neti-mobile-image-viewing-example, внутри так же заменить description. Сменить ios bundleIdentifier и
android package.
- нативные разделы ios/android - по факту тут необходимо внести изменения согласно переименованию и смене
package/bundle. Самый простой способ удалить раздел и попробовать его сгенерировать повторно, уже после заполнения
app.json, при помощи `npx expo run:ios` и `npx expo run:android` из раздела example. Первый запуск этих
команд должен будет создать требуемые разделы.
- src/components/Content.tsx - rn-neti-mobile-image-viewing

# Что необходимо сделать до релиза
- Заполнить в CODE_OF_CONDUCT.md - INSERT CONTACT METHOD заменить на актуальный метод связи (соглашение по общению
внутри сообщества, метод связи, чтобы указать на нарушение).
- Удалить этот файл (PRE_RELEASE.md) перед релизом

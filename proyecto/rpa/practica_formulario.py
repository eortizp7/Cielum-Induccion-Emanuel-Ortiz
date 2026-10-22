"""Ejercicio intermedio: bot que entra a un formulario de pruebas público, lo llena y toma una captura.

Sitio de práctica: https://www.selenium.dev/selenium/web/web-form.html
Uso:  python practica_formulario.py          (se ve el navegador)
      $env:HEADLESS="1"; python practica_formulario.py   (sin ventana)
"""
import os
import sys
from pathlib import Path

from playwright.sync_api import TimeoutError as PlaywrightTimeout
from playwright.sync_api import expect, sync_playwright

URL = "https://www.selenium.dev/selenium/web/web-form.html"
CAPTURAS = Path(__file__).parent / "capturas"


def main() -> int:
    CAPTURAS.mkdir(exist_ok=True)
    headless = os.environ.get("HEADLESS", "0") == "1"

    with sync_playwright() as p:
        navegador = p.chromium.launch(headless=headless, slow_mo=0 if headless else 300)
        pagina = navegador.new_page(viewport={"width": 1100, "height": 900})
        try:
            pagina.goto(URL)

            # Selectores por name: más estables que posiciones o clases de estilo
            pagina.locator('input[name="my-text"]').fill("Emanuel Ortiz")
            pagina.locator('input[name="my-password"]').fill("clave-de-prueba")
            pagina.locator('textarea[name="my-textarea"]').fill("Formulario llenado por un bot de Playwright (Cielum, parte 7).")
            pagina.locator('select[name="my-select"]').select_option("2")
            pagina.locator("#my-check-2").check()
            pagina.locator("#my-radio-2").check()

            # Captura del formulario ya lleno, antes de enviar
            pagina.screenshot(path=str(CAPTURAS / "formulario_lleno.png"), full_page=True)

            pagina.get_by_role("button", name="Submit").click()

            # Espera explícita al resultado (nada de sleep): la página nueva debe decir "Received!"
            expect(pagina.locator("#message")).to_have_text("Received!", timeout=10_000)
            pagina.screenshot(path=str(CAPTURAS / "formulario_enviado.png"), full_page=True)
            print("OK: formulario enviado y confirmado ('Received!').")
            return 0
        except (PlaywrightTimeout, AssertionError) as error:
            # Captura en error: es lo primero que se mira cuando un bot falla
            destino = CAPTURAS / "formulario_error.png"
            pagina.screenshot(path=str(destino), full_page=True)
            print(f"ERROR: {error}\nCaptura guardada en {destino}", file=sys.stderr)
            return 1
        finally:
            navegador.close()


if __name__ == "__main__":
    sys.exit(main())

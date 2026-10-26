// Named constants replacing magic numbers and magic strings
const ROLE_ADMIN = 'ADMIN';
const ROLE_USER = 'USER';
const FORMAT_CSV = 'CSV';
const FORMAT_HTML = 'HTML';
const PRIORITY_VALUE_THRESHOLD = 1000;
const USER_VALUE_LIMIT = 500;

export class ReportGenerator {
  constructor() {
    // Dead code removido: parâmetro 'database' e this.db nunca eram utilizados
  }

  /**
   * Gera um relatório de itens baseado no tipo e no usuário.
   * - Admins veem tudo.
   * - Users comuns só veem itens com valor <= 500.
   */
  generateReport(reportType, user, items) {
    let report = this._buildHeader(reportType, user);
    let total = 0;

    for (const item of items) {
      const row = this._buildItemRow(reportType, user, item);
      if (row !== null) {
        report += row;
        total += item.value;
      }
    }

    report += this._buildFooter(reportType, total);
    return report.trim();
  }

  // --- Extracted: Header generation ---
  _buildHeader(reportType, user) {
    if (reportType === FORMAT_CSV) {
      return 'ID,NOME,VALOR,USUARIO\n';
    }
    if (reportType === FORMAT_HTML) {
      return (
        '<html><body>\n' +
        '<h1>Relatório</h1>\n' +
        `<h2>Usuário: ${user.name}</h2>\n` +
        '<table>\n' +
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
      );
    }
    return '';
  }

  // --- Extracted: Footer generation ---
  _buildFooter(reportType, total) {
    if (reportType === FORMAT_CSV) {
      return `\nTotal,,\n${total},,\n`;
    }
    if (reportType === FORMAT_HTML) {
      return `</table>\n<h3>Total: ${total}</h3>\n</body></html>\n`;
    }
    return '';
  }

  // --- Extracted: Per-item row generation (returns null if item is filtered out) ---
  _buildItemRow(reportType, user, item) {
    if (user.role === ROLE_ADMIN) {
      return this._buildAdminRow(reportType, user, item);
    }
    if (user.role === ROLE_USER && item.value <= USER_VALUE_LIMIT) {
      return this._buildUserRow(reportType, user, item);
    }
    return null;
  }

  // --- Extracted: Row for admin users ---
  _buildAdminRow(reportType, user, item) {
    if (item.value > PRIORITY_VALUE_THRESHOLD) {
      item.priority = true;
    }
    if (reportType === FORMAT_CSV) {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    if (reportType === FORMAT_HTML) {
      const style = item.priority ? ' style="font-weight:bold;"' : '';
      return `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }
    return null;
  }

  // --- Extracted: Row for standard users ---
  _buildUserRow(reportType, user, item) {
    if (reportType === FORMAT_CSV) {
      return `${item.id},${item.name},${item.value},${user.name}\n`;
    }
    if (reportType === FORMAT_HTML) {
      return `<tr><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
    }
    return null;
  }
}

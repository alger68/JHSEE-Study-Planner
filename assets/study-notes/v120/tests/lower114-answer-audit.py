"""Exact-arithmetic/symbolic audit of locally authored mathematics options (no web data eval)."""
from pathlib import Path
import json, subprocess, re, sys
import sympy as S
from sympy.parsing.sympy_parser import parse_expr,standard_transformations,implicit_multiplication_application,rationalize
root=Path(__file__).resolve().parents[1]
raw=subprocess.check_output(['node','-e','console.log(JSON.stringify(require('+json.dumps(str(root/'modules/lower114-completion.cjs'))+').audits()))'],text=True)
records=json.loads(raw)
trans=standard_transformations+(implicit_multiplication_application,rationalize)
local={n:S.Symbol(n,real=True) for n in ['x','m','n','k','a','b']};local.update({'sqrt':S.sqrt,'floor':S.floor,'abs':S.Abs,'gcd':S.gcd,'lcm':S.lcm,'pi':S.pi})
def parse(text):
 text=text.translate(str.maketrans({'−':'-','＋':'+','×':'*','÷':'/','（':'(', '）':')','²':'**2','³':'**3','⁴':'**4','π':'pi'}))
 text=re.sub(r'√([0-9]+)',r'sqrt(\1)',text)
 return parse_expr(text,local_dict=local,transformations=trans)
def valset(text):return set(parse(s) for s in text.strip('{}').replace('，',',').split(','))
passed=[];issues=[]
for q in records:
 try:
  kind,expr=q['proof'].split(':',1)
  if kind=='set':
   target=valset(expr); matches=[valset(o)==target for o in q['choices']]
  elif kind=='roots':
   target=set(S.solve(parse(expr),local['x']));matches=[valset(o)==target for o in q['choices']]
  elif kind in ['quotient','remainder']:
   lhs,rhs=expr.split(';');quotient,remainder=S.div(parse(lhs),parse(rhs),local['x']);target=quotient if kind=='quotient' else remainder;matches=[S.simplify(parse(o)-target)==0 for o in q['choices']]
  elif kind in ['calc','poly']:
   target=parse(expr);matches=[S.simplify(parse(o)-target)==0 for o in q['choices']]
  else:raise ValueError('unknown proof kind '+kind)
  assert matches==[True,False,False,False],(q['choices'],str(target),matches)
  passed.append(q['id'])
 except Exception as e:issues.append({'id':q['id'],'error':str(e),'question':q['question']})
report={'checked':len(records),'passed':len(passed),'failed':len(issues),'issues':issues,'boundary':'數值與代數的精確等值／單一正解檢查；概念題及來源涵蓋程度另行閱讀審查。'}
if len(sys.argv)>1:Path(sys.argv[1]).write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(issues))

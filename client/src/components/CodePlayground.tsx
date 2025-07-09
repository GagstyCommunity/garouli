
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Download, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodePlaygroundProps {
  language: string;
  initialCode?: string;
  readOnly?: boolean;
  onCodeChange?: (code: string) => void;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({
  language = 'javascript',
  initialCode = '',
  readOnly = false,
  onCodeChange
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

  const languageTemplates = {
    javascript: `// JavaScript Playground
function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));`,
    python: `# Python Playground
def greet(name):
    return f"Hello, {name}!"

print(greet('World'))`,
    html: `<!DOCTYPE html>
<html>
<head>
    <title>HTML Playground</title>
</head>
<body>
    <h1>Hello, World!</h1>
    <p>This is an HTML playground.</p>
</body>
</html>`
  };

  useEffect(() => {
    if (!code && languageTemplates[language as keyof typeof languageTemplates]) {
      setCode(languageTemplates[language as keyof typeof languageTemplates]);
    }
  }, [language]);

  const executeCode = async () => {
    setIsRunning(true);
    try {
      if (language === 'javascript') {
        // Capture console.log output
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args) => {
          logs.push(args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' '));
        };

        try {
          // Execute the code
          eval(code);
          setOutput(logs.join('\n') || 'Code executed successfully (no output)');
        } catch (error: any) {
          setOutput(`Error: ${error.message}`);
        } finally {
          console.log = originalLog;
        }
      } else {
        // For other languages, simulate execution
        setOutput(`Code executed successfully!\n\nNote: ${language} execution is simulated in this demo.`);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    setCode(languageTemplates[language as keyof typeof languageTemplates] || '');
    setOutput('');
  };

  const shareCode = () => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied!",
      description: "Code has been copied to clipboard"
    });
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center gap-2">
              Code Playground
              <Badge variant="outline">{language}</Badge>
            </CardTitle>
            <CardDescription>
              Write, run, and experiment with {language} code
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={resetCode}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            <Button size="sm" variant="outline" onClick={shareCode}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="code" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="code">Code Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="space-y-4">
            <div className="relative">
              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                readOnly={readOnly}
                className="w-full h-64 p-4 font-mono text-sm border rounded-lg bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder={`Write your ${language} code here...`}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Lines: {code.split('\n').length} | Characters: {code.length}
              </div>
              <Button onClick={executeCode} disabled={isRunning || readOnly}>
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? 'Running...' : 'Run Code'}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4">
            <div className="min-h-64 p-4 bg-black text-green-400 font-mono text-sm rounded-lg overflow-auto">
              <pre className="whitespace-pre-wrap">{output || 'No output yet. Run your code to see results.'}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodePlayground;

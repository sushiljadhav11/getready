// State Elements
let loggedInUser = null;
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? "http://localhost:5000/api" : window.location.origin + "/api";
let currentExamTimer = null;
let examTimeElapsed = 0;
const EXAM_TIME_LIMIT = 600; // 10 minutes in seconds

// Mock Database / Frontend Mapping
const DATABASE = {
    subjects: [
        { id: 'aptitude', title: 'Quantitative Aptitude', icon: '📊', description: 'Master mathematical concepts and problem-solving.' },
        { id: 'dsa', title: 'Data Structures & Algorithms', icon: '💻', description: 'Build a strong foundation in algorithmic thinking.' },
        { id: 'corecs', title: 'Core CS Fundamentals', icon: '⚙️', description: 'OS, DBMS, Computer Networks, and more.' }
    ],
    topicCategories: {
        'aptitude': [
            {
                category: 'Arithmetic Topics',
                topics: [
                    { id: 'number-system', title: 'Number System', difficulty: 'Medium' },
                    { id: 'hcf-lcm', title: 'HCF & LCM', difficulty: 'Easy' },
                    { id: 'percentages', title: 'Percentages', difficulty: 'Easy' },
                    { id: 'profit-loss', title: 'Profit and Loss', difficulty: 'Medium' },
                    { id: 'sci', title: 'Simple & Compound Interest', difficulty: 'Medium' },
                    { id: 'ratio', title: 'Ratio and Proportion', difficulty: 'Easy' },
                    { id: 'averages', title: 'Averages', difficulty: 'Easy' },
                    { id: 'mixtures', title: 'Mixtures & Allegations', difficulty: 'Hard' },
                    { id: 'time-work', title: 'Time and Work', difficulty: 'Medium' },
                    { id: 'pipes', title: 'Pipes and Cisterns', difficulty: 'Medium' },
                    { id: 'tsd', title: 'Time, Speed, and Distance', difficulty: 'Hard' }
                ]
            }
        ],
        'dsa': [{ category: 'Core DSA', topics: [ { id: 'arrays', title: 'Arrays & Strings', difficulty: 'Easy' } ] }],
        'corecs': [
            { category: 'Operating Systems (OS)', topics: [ { id: 'os-notes', title: 'OS Summary Notes', difficulty: 'Medium' } ] },
            { category: 'Database Management (DBMS)', topics: [ { id: 'dbms-notes', title: 'DBMS Summary Notes', difficulty: 'Medium' } ] },
            { category: 'Computer Networks (CNS)', topics: [ { id: 'cns-notes', title: 'Networks Summary Notes', difficulty: 'Hard' } ] },
            { category: 'System Design', topics: [ { id: 'sys-design-notes', title: 'Sys Design Summary Notes', difficulty: 'Hard' } ] }
        ]
    },
    content: {
        'time-work': {
            concepts: `
                <h3>Time and Work Concepts</h3>
                <p>The basic rule of Time and Work is that <strong>Work = Rate × Time</strong>.</p>
                <div class="concept-content">
                    <h4>Key Formulas:</h4>
                    <ul>
                        <li>If A can do work in 'n' days, A's 1 day work = 1/n.</li>
                        <li>If A is thrice as good as B, ratio of work = 3:1, ratio of time = 1:3.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>A in 15 days, B in 20. Together?</p><div class="solution-box"><p><strong>Solution:</strong> A=1/15, B=1/20. Total=7/60. Days=60/7.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>A+B in 12. A in 20. B half day daily, then together?</p><div class="solution-box"><p><strong>Solution:</strong> B=1/30. B half=1/60. (A+half B)=1/15. 15 days.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>A twice as good as B, together finish in 14. A alone?</p><div class="solution-box"><p><strong>Solution:</strong> A's 1 day is 2/3 of 1/14. A takes 21 days.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>A takes twice B's time. Together in 2. B alone?</p><div class="solution-box"><p><strong>Solution:</strong> 1/2x + 1/x = 1/2. B takes 3 days.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>P in 12, Q in 16. Work 4 days together. Fraction left?</p><div class="solution-box"><p><strong>Solution:</strong> 4*(1/12+1/16)=7/12. Left=5/12.</p></div></div>
            `
        },
        'number-system': {
            concepts: `
                <h3>Number System Concepts</h3>
                <p>Operations, cyclicity, remainders, and classification.</p>
                <div class="concept-content">
                    <h4>Key Fundamentals:</h4>
                    <ul>
                        <li><strong>Prime Numbers</strong>: Divisible by 1 and themselves.</li>
                        <li><strong>Unit Digit</strong>: Cyclicity of powers is 4 for 2, 3, 7, 8.</li>
                        <li><strong>Remainder Theorem</strong>: Finding remainders of large numbers.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>Unit digit of 7^95?</p><div class="solution-box"><p><strong>Solution:</strong> 95%4=3. 7^3 ends in 3.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>Sum of first 50 odd natural numbers?</p><div class="solution-box"><p><strong>Solution:</strong> 50^2 = 2500.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Divided by 119 leaves 19. Divided by 17?</p><div class="solution-box"><p><strong>Solution:</strong> 119 is divisible by 17, so 19%17 = 2.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Difference between local and face value of 7 in 32675149?</p><div class="solution-box"><p><strong>Solution:</strong> 70000 - 7 = 69993.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Largest 4 digit exactly divisible by 88?</p><div class="solution-box"><p><strong>Solution:</strong> 9999%88=55. 9999-55=9944.</p></div></div>
            `
        },
        'hcf-lcm': {
            concepts: `
                <h3>HCF & LCM Concepts</h3>
                <p>Focuses on highest common factors and lowest common multiples.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>Product of two numbers = HCF × LCM.</li>
                        <li>HCF of fractions = HCF of Numerators / LCM of Denominators.</li>
                        <li>LCM of fractions = LCM of Numerators / HCF of Denominators.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>LCM of 87 and 145?</p><div class="solution-box"><p><strong>Solution:</strong> 87=3×29, 145=5×29. LCM=3×5×29=435.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>Two numbers in ratio 3:4. HCF is 4. LCM is?</p><div class="solution-box"><p><strong>Solution:</strong> Numbers are 12 and 16. LCM=48.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Product = 4107. HCF is 37. Greater number is?</p><div class="solution-box"><p><strong>Solution:</strong> Let numbers be 37a, 37b. 37a×37b=4107 -> a×b=3. Numbers are 37, 111. Greater=111.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Find greatest number dividing 43, 91, 183 leaving same remainder.</p><div class="solution-box"><p><strong>Solution:</strong> HCF of (91-43), (183-91), (183-43) = HCF of 48, 92, 140 = 4.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>LCM of two numbers is 48. Sum is 32. Difference is?</p><div class="solution-box"><p><strong>Solution:</strong> Numbers are 12, 20. Diff=8.</p></div></div>
            `
        },
        'percentages': {
            concepts: `
                <h3>Percentages Concepts</h3>
                <p>Expressing numbers as a fraction of 100.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>x% of y = (x/100)*y.</li>
                        <li>Percentage Increase = (Increase / Original Value) * 100.</li>
                        <li>Successive discount of a% and b% = a + b - (ab/100).</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>Half of 1 percent written as decimal?</p><div class="solution-box"><p><strong>Solution:</strong> 0.5% = 0.5/100 = 0.005.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>2 is what percent of 50?</p><div class="solution-box"><p><strong>Solution:</strong> (2/50)*100 = 4%.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>If A's height is 10% more than B's, by what percent is B's less than A's?</p><div class="solution-box"><p><strong>Solution:</strong> [10/(100+10)]*100 = 9.09%.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Price increases from 10 to 12.5. Increase percent?</p><div class="solution-box"><p><strong>Solution:</strong> (2.5/10)*100 = 25%.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Population 10,000 increases 10% annually. Pop after 2 years?</p><div class="solution-box"><p><strong>Solution:</strong> 10000*(1.1)^2 = 12100.</p></div></div>
            `
        },
        'profit-loss': {
            concepts: `
                <h3>Profit and Loss Concepts</h3>
                <p>Basic financial transactions.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>Profit = SP - CP. Loss = CP - SP.</li>
                        <li>Profit % = (Profit/CP)*100. Loss % = (Loss/CP)*100.</li>
                        <li>SP = [(100+Profit%)/100] * CP.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>Cost is 150, SP is 180. Profit %?</p><div class="solution-box"><p><strong>Solution:</strong> (30/150)*100 = 20%.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>Man bought toy for 25 and sold for 30. Gain %?</p><div class="solution-box"><p><strong>Solution:</strong> (5/25)*100 = 20%.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Item sold at Rs.480, losing 20%. To gain 20%, what SP?</p><div class="solution-box"><p><strong>Solution:</strong> CP = 480/0.8 = 600. New SP = 600*1.2 = 720.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Vendor bought lemons at 6 for a rupee and sold at 4 for a rupee. Gain%?</p><div class="solution-box"><p><strong>Solution:</strong> CP of 1=1/6. SP of 1=1/4. Profit=(1/4-1/6)/(1/6) = 50%.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Selling price of 5 articles = cost price of 6. Gain%?</p><div class="solution-box"><p><strong>Solution:</strong> Let CP of 1 = 1. SP of 5 = 6. SP of 1 = 1.2. Gain = 20%.</p></div></div>
            `
        },
        'sci': {
            concepts: `
                <h3>Simple & Compound Interest</h3>
                <p>Interest accrued over time linearly or exponentially.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>SI = (P * R * T) / 100.</li>
                        <li>Amount (CI) = P * (1 + R/100)^T.</li>
                        <li>CI = Amount - Principal.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>SI on 1000 at 5% for 2 years?</p><div class="solution-box"><p><strong>Solution:</strong> (1000*5*2)/100 = 100.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>At what rate SI will a sum double in 8 years?</p><div class="solution-box"><p><strong>Solution:</strong> Let P=100. SI=100. R = (100*100)/(100*8) = 12.5%.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>CI on 5000 at 8% for 2 yrs?</p><div class="solution-box"><p><strong>Solution:</strong> 5000*(1.08)^2 - 5000 = 5832 - 5000 = 832.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Difference between CI and SI on 1000 for 2 yrs at 10%?</p><div class="solution-box"><p><strong>Solution:</strong> Diff = P(R/100)^2 = 1000(0.1)^2 = 10.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>A sum doubles in 4 years at CI. It becomes 8 times in?</p><div class="solution-box"><p><strong>Solution:</strong> 2^3 times, so 4*3 = 12 years.</p></div></div>
            `
        },
        'ratio': {
            concepts: `
                <h3>Ratio and Proportion</h3>
                <p>Comparing quantities of the same units.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>If a/b = c/d, then a:b::c:d.</li>
                        <li>Mean proportion of a and b is √(ab).</li>
                        <li>Third proportion of a, b is b²/a.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>A:B = 2:3, B:C = 4:5. A:B:C?</p><div class="solution-box"><p><strong>Solution:</strong> Multiply A:B by 4 -> 8:12. B:C by 3 -> 12:15. Result: 8:12:15.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>Fourth proportional to 12, 21, 8?</p><div class="solution-box"><p><strong>Solution:</strong> 12/21 = 8/x -> x = (21*8)/12 = 14.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Two numbers are in ratio 3:5. If 9 is subtracted from both, ratio becomes 12:23. Numbers?</p><div class="solution-box"><p><strong>Solution:</strong> (3x-9)/(5x-9)=12/23. 69x-207=60x-108. 9x=99 -> x=11. Numbers 33, 55.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>A bag has Rs 1, 50p, 25p in ratio 5:6:8. Total amount is Rs 210. Find 1Rs coins.</p><div class="solution-box"><p><strong>Solution:</strong> Value ratio=5x : 3x : 2x. Total=10x=210 -> x=21. Coins=5*21=105.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Divide 1162 among A,B,C in ratio 35:28:20.</p><div class="solution-box"><p><strong>Solution:</strong> Total parts=83. A=(35/83)*1162 = 490.</p></div></div>
            `
        },
        'averages': {
            concepts: `
                <h3>Averages</h3>
                <p>The central or typical value in a set of data.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>Average = Sum of observations / Number of observations.</li>
                        <li>Average speed = Total distance / Total time.</li>
                        <li>If speed from A to B is 'x' and B to A is 'y', average speed = 2xy/(x+y).</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>Average of first 5 multiples of 3?</p><div class="solution-box"><p><strong>Solution:</strong> 3*(1+2+3+4+5)/5 = 9.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>Avg of 20 numbers is 15. If each is multiplied by 5, new avg?</p><div class="solution-box"><p><strong>Solution:</strong> 15*5 = 75.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Avg age of 30 boys is 14 yrs. When teacher is included, avg becomes 15. Teacher age?</p><div class="solution-box"><p><strong>Solution:</strong> (31*15) - (30*14) = 465 - 420 = 45 yrs.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>A travels at 60kmph and returns at 40kmph. Average speed?</p><div class="solution-box"><p><strong>Solution:</strong> 2*60*40/(60+40) = 4800/100 = 48 kmph.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Batsman makes 87 in 17th inning, increases avg by 3. Current avg?</p><div class="solution-box"><p><strong>Solution:</strong> 17*x - 16*(x-3) = 87 -> x + 48 = 87 -> x = 39.</p></div></div>
            `
        },
        'mixtures': {
            concepts: `
                <h3>Mixtures & Allegations</h3>
                <p>Rule to mix two quantities of different prices.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>(Quantity of cheaper)/(Quantity of dearer) = (Price of dearer - Mean Price) / (Mean Price - Price of cheaper).</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>Tea at Rs 62/kg mixed with Rs 72/kg to get mixture worth Rs 65/kg. Ratio?</p><div class="solution-box"><p><strong>Solution:</strong> (72-65)/(65-62) = 7:3.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>In what ratio should water be mixed with milk at Rs 12/L to get Rs 8/L?</p><div class="solution-box"><p><strong>Solution:</strong> Water = 0. (12-8)/(8-0) = 4/8 = 1:2.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Milk and water in two vessels are 5:3 and 2:3. In what ratio to mix to get 1:1?</p><div class="solution-box"><p><strong>Solution:</strong> Milk fractions=5/8 and 2/5. Target=1/2. Allegation: (1/2-2/5)/(5/8-1/2) = (1/10)/(1/8) = 4:5.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Vessel holds 40L milk. 4L taken and replaced with water. Done 3 times. Milk left?</p><div class="solution-box"><p><strong>Solution:</strong> 40*(1 - 4/40)^3 = 40*(0.9)^3 = 29.16L.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Rs 10/kg rice mixed with Rs 15/kg rice to sell at Rs 14/kg. Ratio?</p><div class="solution-box"><p><strong>Solution:</strong> (15-14)/(14-10) = 1:4.</p></div></div>
            `
        },
        'pipes': {
            concepts: `
                <h3>Pipes and Cisterns</h3>
                <p>Time and work rules applied to filling and emptying tanks.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>If pipe fills in x hours, 1 hour work = 1/x.</li>
                        <li>If pipe empties in y hours, 1 hour work = -1/y.</li>
                        <li>Both open: Net 1 hour = 1/x - 1/y.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>A fills in 10h, B in 15h. Both together?</p><div class="solution-box"><p><strong>Solution:</strong> 1/10 + 1/15 = 5/30 = 1/6. Total 6 hours.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>A fills in 10h. B empties in 15h. Both open?</p><div class="solution-box"><p><strong>Solution:</strong> 1/10 - 1/15 = 1/30. Fills in 30 hours.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>A and B fill in 20 and 30 mins. C empties in 15 mins. All open?</p><div class="solution-box"><p><strong>Solution:</strong> 1/20 + 1/30 - 1/15 = 3/60+2/60-4/60 = 1/60. 60 mins.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Two pipes 12h and 15h. Third empties in 20h. Together?</p><div class="solution-box"><p><strong>Solution:</strong> 1/12+1/15-1/20 = 5/60+4/60-3/60 = 6/60 = 1/10. 10 hours.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Pipe fills tank in 5h, leak empties in 10h. Filled?</p><div class="solution-box"><p><strong>Solution:</strong> 1/5 - 1/10 = 1/10. 10 hours.</p></div></div>
            `
        },
        'tsd': {
            concepts: `
                <h3>Time, Speed, and Distance</h3>
                <p>Relationships between distance traveled and time elapsed.</p>
                <div class="concept-content">
                    <h4>Formulas:</h4>
                    <ul>
                        <li>Distance = Speed × Time.</li>
                        <li>km/hr to m/s: Multiply by 5/18.</li>
                        <li>m/s to km/hr: Multiply by 18/5.</li>
                        <li>Relative speed: Add if opposite directions, subtract if same.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Solved Examples</h3>
                <div class="example-panel"><h4>Example 1</h4><p>Convert 72 km/hr to m/s.</p><div class="solution-box"><p><strong>Solution:</strong> 72 * (5/18) = 20 m/s.</p></div></div>
                <div class="example-panel"><h4>Example 2</h4><p>Train 100m long moving at 36km/hr crosses a pole in?</p><div class="solution-box"><p><strong>Solution:</strong> Speed=10m/s. Time=100/10=10 seconds.</p></div></div>
                <div class="example-panel"><h4>Example 3</h4><p>Man covers 600m in 5 mins. Speed in km/hr?</p><div class="solution-box"><p><strong>Solution:</strong> 600m/300s=2m/s. 2*(18/5)=7.2 km/hr.</p></div></div>
                <div class="example-panel"><h4>Example 4</h4><p>Two trains opposite directions at 40 and 50km/hr. Relative speed?</p><div class="solution-box"><p><strong>Solution:</strong> 40+50 = 90 km/hr.</p></div></div>
                <div class="example-panel"><h4>Example 5</h4><p>Walking 3/4 of usual speed, reaches 20 mins late. Usual time?</p><div class="solution-box"><p><strong>Solution:</strong> New time=4/3 of old. 4/3 T - T = 20 -> T/3=20 -> T=60 mins.</p></div></div>
            `
        },
        'os-notes': {
            concepts: `
                <h3>Operating Systems Fundamental Notes</h3>
                <p>The core layer between application software and hardware.</p>
                <div class="concept-content">
                    <h4>Key Topics:</h4>
                    <ul>
                        <li><strong>Process Management:</strong> States (New, Ready, Running, Waiting, Terminated). Context switching.</li>
                        <li><strong>Scheduling Algorithms:</strong> FCFS, SJF, Round Robin, Multilevel Queue.</li>
                        <li><strong>Deadlocks:</strong> Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Handled via Banker's Algorithm.</li>
                        <li><strong>Memory Management:</strong> Paging (fixes external fragmentation), Segmentation, Virtual Memory, Thrashing.</li>
                        <li><strong>Concurrency:</strong> Semaphores vs Mutex, Monitors, Race Conditions.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Common Interview Questions</h3>
                <div class="example-panel"><h4>Question 1</h4><p>Difference between Process and Thread?</p><div class="solution-box"><p><strong>Solution:</strong> A process is a heavily isolated execution instance. A thread is an execution unit within a process; threads share memory and resources.</p></div></div>
                <div class="example-panel"><h4>Question 2</h4><p>What is Thrashing?</p><div class="solution-box"><p><strong>Solution:</strong> When a system spends more time page-faulting and swapping memory rather than executing actual processes.</p></div></div>
                <div class="example-panel"><h4>Question 3</h4><p>What is a Mutex?</p><div class="solution-box"><p><strong>Solution:</strong> A locking mechanism used to synchronize access to a resource across multiple threads.</p></div></div>
            `
        },
        'dbms-notes': {
            concepts: `
                <h3>DBMS Fundamental Notes</h3>
                <p>Architecture and operations of Database Management Systems.</p>
                <div class="concept-content">
                    <h4>Key Topics:</h4>
                    <ul>
                        <li><strong>ACID Properties:</strong> Atomicity, Consistency, Isolation, Durability.</li>
                        <li><strong>Normalization:</strong> 1NF (atomic), 2NF (no partial dependency), 3NF (no transitive dependency), BCNF.</li>
                        <li><strong>Indexing:</strong> B-Trees and B+ Trees. Clustered vs Non-Clustered indexes.</li>
                        <li><strong>Transactions & Concurrency:</strong> Serializability, Two-Phase Locking (2PL), Deadlock prevention.</li>
                        <li><strong>CAP Theorem:</strong> Consistency, Availability, Partition tolerance (pick 2).</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Common Interview Questions</h3>
                <div class="example-panel"><h4>Question 1</h4><p>Difference between TRUNCATE and DELETE?</p><div class="solution-box"><p><strong>Solution:</strong> TRUNCATE is DDL (fast, resets identity, cannot be rolled back easily). DELETE is DML (slower, log-based, table scans).</p></div></div>
                <div class="example-panel"><h4>Question 2</h4><p>What is a Foreign Key?</p><div class="solution-box"><p><strong>Solution:</strong> A constrained field that maps to the Primary Key of another table to maintain referential integrity.</p></div></div>
                <div class="example-panel"><h4>Question 3</h4><p>Explain Joins.</p><div class="solution-box"><p><strong>Solution:</strong> INNER (matches only), LEFT (all left + matches), RIGHT (all right + matches), FULL OUTER (everything).</p></div></div>
            `
        },
        'cns-notes': {
            concepts: `
                <h3>Computer Networks Notes</h3>
                <p>The transmission and routing architectures driving the internet.</p>
                <div class="concept-content">
                    <h4>Key Topics:</h4>
                    <ul>
                        <li><strong>OSI Model (7 Layers):</strong> Physical, Data Link, Network, Transport, Session, Presentation, Application.</li>
                        <li><strong>TCP vs UDP:</strong> TCP is reliable/connection-oriented (3-way handshake). UDP is fast/connectionless.</li>
                        <li><strong>IP Addressing:</strong> IPv4 vs IPv6, Subnet masks, CIDR notation.</li>
                        <li><strong>Routing Protocols:</strong> OSPF (Link-State), BGP (Path-Vector).</li>
                        <li><strong>Application Protocols:</strong> HTTP/HTTPS (Port 80/443), DNS (Port 53), FTP (Port 21).</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Common Interview Questions</h3>
                <div class="example-panel"><h4>Question 1</h4><p>Explain the TCP 3-Way Handshake.</p><div class="solution-box"><p><strong>Solution:</strong> SYN -> SYN-ACK -> ACK. Used to establish a reliable connection before data transfer.</p></div></div>
                <div class="example-panel"><h4>Question 2</h4><p>What problem does DNS solve?</p><div class="solution-box"><p><strong>Solution:</strong> Translates human-readable domain names (google.com) into machine-routable IP addresses.</p></div></div>
                <div class="example-panel"><h4>Question 3</h4><p>What is a MAC address?</p><div class="solution-box"><p><strong>Solution:</strong> A 48-bit hardware address burnt into the NIC, used in the Data Link Layer (Layer 2) for local network delivery.</p></div></div>
            `
        },
        'sys-design-notes': {
            concepts: `
                <h3>System Design Notes</h3>
                <p>Architecting scalable and reliable high-traffic systems.</p>
                <div class="concept-content">
                    <h4>Key Topics:</h4>
                    <ul>
                        <li><strong>Scaling:</strong> Vertical Scaling (upgrading single node) vs Horizontal Scaling (adding more nodes).</li>
                        <li><strong>Load Balancing:</strong> Distributes traffic across instances (Algorithms: Round Robin, Least Connections).</li>
                        <li><strong>Caching:</strong> Redis, Memcached. Strategies: Write-through, Write-around, Write-back.</li>
                        <li><strong>Database Scaling:</strong> Sharding (horizontal partition), Replication (Master-Slave), Read Replicas.</li>
                        <li><strong>Microservices:</strong> API Gateways, Event Queues (Kafka, RabbitMQ) decoupling components.</li>
                    </ul>
                </div>
            `,
            examples: `
                <h3>Common Interview Questions</h3>
                <div class="example-panel"><h4>Question 1</h4><p>When to use SQL vs NoSQL?</p><div class="solution-box"><p><strong>Solution:</strong> SQL for complex relational queries, strict ACID, and defined schemas. NoSQL for massive horizontal scale, flexible data (JSON), and fast key-value lookups.</p></div></div>
                <div class="example-panel"><h4>Question 2</h4><p>What is a CDN?</p><div class="solution-box"><p><strong>Solution:</strong> Content Delivery Network. Edge servers placed globally that cache static assets to reduce latency for users everywhere.</p></div></div>
                <div class="example-panel"><h4>Question 3</h4><p>Explain the Publisher/Subscriber pattern.</p><div class="solution-box"><p><strong>Solution:</strong> An asynchronous service-to-service communication method where message senders (publishers) do not explicitly send to specific receivers (subscribers), but route through a decoupled message broker.</p></div></div>
            `
        }
    }
};

const mainContent = document.getElementById('main-content');
const dashboardBtn = document.querySelector('.nav-btn[data-target="dashboard"]');

function renderDashboard() {
    if (!loggedInUser) return renderAuth('signin');
    let html = `
        <div class="fade-in">
            <h2>Welcome back, ${loggedInUser.name}!</h2>
            <p>Select a domain to start preparing.</p>
            <div class="dashboard-grid">
    `;

    DATABASE.subjects.forEach(subject => {
        html += `
            <div class="glass-panel subject-card" onclick="renderSubject('${subject.id}')">
                <div class="subject-icon">${subject.icon}</div>
                <h3 class="subject-title">${subject.title}</h3>
                <p>${subject.description}</p>
            </div>
        `;
    });

    html += `</div></div>`;
    mainContent.innerHTML = html;
}

const BLIND_75 = [
    { id: 'q1', title: 'Two Sum', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
    { id: 'q2', title: 'Best Time to Buy and Sell Stock', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { id: 'q3', title: 'Contains Duplicate', topic: 'Arrays', difficulty: 'Easy', link: 'https://leetcode.com/problems/contains-duplicate/' },
    { id: 'q4', title: 'Product of Array Except Self', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/product-of-array-except-self/' },
    { id: 'q5', title: 'Maximum Subarray', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-subarray/' },
    { id: 'q6', title: 'Maximum Product Subarray', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/maximum-product-subarray/' },
    { id: 'q7', title: 'Find Minimum in Rotated Sorted Array', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' },
    { id: 'q8', title: 'Search in Rotated Sorted Array', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    { id: 'q9', title: '3Sum', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
    { id: 'q10', title: 'Container With Most Water', topic: 'Arrays', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 'q11', title: 'Sum of Two Integers', topic: 'Binary', difficulty: 'Medium', link: 'https://leetcode.com/problems/sum-of-two-integers/' },
    { id: 'q12', title: 'Number of 1 Bits', topic: 'Binary', difficulty: 'Easy', link: 'https://leetcode.com/problems/number-of-1-bits/' },
    { id: 'q13', title: 'Counting Bits', topic: 'Binary', difficulty: 'Easy', link: 'https://leetcode.com/problems/counting-bits/' },
    { id: 'q14', title: 'Missing Number', topic: 'Binary', difficulty: 'Easy', link: 'https://leetcode.com/problems/missing-number/' },
    { id: 'q15', title: 'Reverse Bits', topic: 'Binary', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-bits/' },
    { id: 'q16', title: 'Climbing Stairs', topic: 'Dynamic Programming', difficulty: 'Easy', link: 'https://leetcode.com/problems/climbing-stairs/' },
    { id: 'q17', title: 'Coin Change', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/coin-change/' },
    { id: 'q18', title: 'Longest Increasing Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-increasing-subsequence/' },
    { id: 'q19', title: 'Longest Common Subsequence', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-common-subsequence/' },
    { id: 'q20', title: 'Word Break', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-break/' },
    { id: 'q21', title: 'Combination Sum', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/combination-sum/' },
    { id: 'q22', title: 'House Robber', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber/' },
    { id: 'q23', title: 'House Robber II', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/house-robber-ii/' },
    { id: 'q24', title: 'Decode Ways', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/decode-ways/' },
    { id: 'q25', title: 'Unique Paths', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/unique-paths/' },
    { id: 'q26', title: 'Jump Game', topic: 'Dynamic Programming', difficulty: 'Medium', link: 'https://leetcode.com/problems/jump-game/' },
    { id: 'q27', title: 'Clone Graph', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
    { id: 'q28', title: 'Course Schedule', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/' },
    { id: 'q29', title: 'Pacific Atlantic Water Flow', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
    { id: 'q30', title: 'Number of Islands', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 'q31', title: 'Longest Consecutive Sequence', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-consecutive-sequence/' },
    { id: 'q32', title: 'Alien Dictionary', topic: 'Graphs', difficulty: 'Hard', link: 'https://leetcode.com/problems/alien-dictionary/' },
    { id: 'q33', title: 'Graph Valid Tree', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/graph-valid-tree/' },
    { id: 'q34', title: 'Number of Connected Components', topic: 'Graphs', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/' },
    { id: 'q35', title: 'Insert Interval', topic: 'Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/insert-interval/' },
    { id: 'q36', title: 'Merge Intervals', topic: 'Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/' },
    { id: 'q37', title: 'Non-overlapping Intervals', topic: 'Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/non-overlapping-intervals/' },
    { id: 'q38', title: 'Meeting Rooms', topic: 'Intervals', difficulty: 'Easy', link: 'https://leetcode.com/problems/meeting-rooms/' },
    { id: 'q39', title: 'Meeting Rooms II', topic: 'Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/meeting-rooms-ii/' },
    { id: 'q40', title: 'Reverse a Linked List', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
    { id: 'q41', title: 'Detect Cycle in a Linked List', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
    { id: 'q42', title: 'Merge Two Sorted Lists', topic: 'Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { id: 'q43', title: 'Merge K Sorted Lists', topic: 'Linked List', difficulty: 'Hard', link: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
    { id: 'q44', title: 'Remove Nth Node From End Of List', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
    { id: 'q45', title: 'Reorder List', topic: 'Linked List', difficulty: 'Medium', link: 'https://leetcode.com/problems/reorder-list/' },
    { id: 'q46', title: 'Set Matrix Zeroes', topic: 'Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/set-matrix-zeroes/' },
    { id: 'q47', title: 'Spiral Matrix', topic: 'Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/spiral-matrix/' },
    { id: 'q48', title: 'Rotate Image', topic: 'Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/rotate-image/' },
    { id: 'q49', title: 'Word Search', topic: 'Matrix', difficulty: 'Medium', link: 'https://leetcode.com/problems/word-search/' },
    { id: 'q50', title: 'Longest Substring Without Repeating Characters', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { id: 'q51', title: 'Longest Repeating Character Replacement', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-repeating-character-replacement/' },
    { id: 'q52', title: 'Minimum Window Substring', topic: 'Strings', difficulty: 'Hard', link: 'https://leetcode.com/problems/minimum-window-substring/' },
    { id: 'q53', title: 'Valid Anagram', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
    { id: 'q54', title: 'Group Anagrams', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' },
    { id: 'q55', title: 'Valid Parentheses', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-parentheses/' },
    { id: 'q56', title: 'Valid Palindrome', topic: 'Strings', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
    { id: 'q57', title: 'Longest Palindromic Substring', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { id: 'q58', title: 'Palindromic Substrings', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/palindromic-substrings/' },
    { id: 'q59', title: 'Encode and Decode Strings', topic: 'Strings', difficulty: 'Medium', link: 'https://leetcode.com/problems/encode-and-decode-strings/' },
    { id: 'q60', title: 'Maximum Depth of Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { id: 'q61', title: 'Same Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/' },
    { id: 'q62', title: 'Invert/Flip Binary Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
    { id: 'q63', title: 'Binary Tree Maximum Path Sum', topic: 'Trees', difficulty: 'Hard', link: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
    { id: 'q64', title: 'Binary Tree Level Order Traversal', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 'q65', title: 'Serialize and Deserialize Binary Tree', topic: 'Trees', difficulty: 'Hard', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
    { id: 'q66', title: 'Subtree of Another Tree', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/subtree-of-another-tree/' },
    { id: 'q67', title: 'Construct Binary Tree from Preorder and Inorder Traversal', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/' },
    { id: 'q68', title: 'Validate Binary Search Tree', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    { id: 'q69', title: 'Kth Smallest Element in a BST', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/' },
    { id: 'q70', title: 'Lowest Common Ancestor of BST', topic: 'Trees', difficulty: 'Easy', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
    { id: 'q71', title: 'Implement Trie (Prefix Tree)', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/implement-trie-prefix-tree/' },
    { id: 'q72', title: 'Design Add and Search Words Data Structure', topic: 'Trees', difficulty: 'Medium', link: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/' },
    { id: 'q73', title: 'Word Search II', topic: 'Trees', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-search-ii/' },
    { id: 'q74', title: 'Top K Frequent Elements', topic: 'Heaps', difficulty: 'Medium', link: 'https://leetcode.com/problems/top-k-frequent-elements/' },
    { id: 'q75', title: 'Find Median from Data Stream', topic: 'Heaps', difficulty: 'Hard', link: 'https://leetcode.com/problems/find-median-from-data-stream/' }
];

window.renderDSA = async function() {
    if (!loggedInUser) return renderAuth('signin');
    
    // Fetch progress
    let completedSet = new Set();
    try {
        const res = await fetch(`${API_URL}/dsa/progress/${loggedInUser.id}`);
        const data = await res.json();
        data.forEach(d => {
            if(d.is_done) completedSet.add(d.question_id);
        });
    } catch(err) {
        console.error("Failed to load DSA Progress");
    }

    let html = `
        <div class="fade-in">
            <div class="breadcrumb" onclick="renderDashboard()">Home &gt; <span>Data Structures & Algorithms</span></div>
            <h2>Blind 75 Sheet Tracker</h2>
            <p>Master these 75 standard DSA questions to crack any coding interview.</p>
            <div class="progress-container" style="margin: 1rem 0 2rem 0; font-weight: bold; color: var(--accent-primary);">
                Progress: ${completedSet.size} / 75 Solved
            </div>
            
            <div class="glass-panel" style="overflow-x: auto;">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th style="width: 50px; text-align: center;">Done</th>
                            <th>Topic</th>
                            <th>Problem Title</th>
                            <th>Difficulty</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    BLIND_75.forEach(q => {
        const isDone = completedSet.has(q.id);
        const diffColor = q.difficulty === 'Easy' ? 'var(--accent-success)' : (q.difficulty === 'Medium' ? 'var(--accent-primary)' : 'var(--accent-danger)');
        html += `
            <tr style="background: ${isDone ? 'rgba(16, 185, 129, 0.05)' : 'transparent'};">
                <td style="text-align: center;">
                    <input type="checkbox" onchange="toggleDSADone('${q.id}', this)" ${isDone ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer; accent-color: var(--accent-success);" />
                </td>
                <td style="color: var(--text-secondary);">${q.topic}</td>
                <td><strong>${q.title}</strong></td>
                <td><span style="color: ${diffColor}; border: 1px solid ${diffColor}; padding: 0.1rem 0.5rem; border-radius: 12px; font-size: 0.8rem;">${q.difficulty}</span></td>
                <td><a href="${q.link}" target="_blank" style="color: var(--accent-primary); text-decoration: none;">Solve &#8599;</a></td>
            </tr>
        `;
    });

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;
}

window.toggleDSADone = async function(questionId, checkboxElem) {
    const isDone = checkboxElem.checked;
    checkboxElem.closest('tr').style.background = isDone ? 'rgba(16, 185, 129, 0.05)' : 'transparent';
    
    try {
        await fetch(`${API_URL}/dsa/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: loggedInUser.id,
                question_id: questionId,
                is_done: isDone
            })
        });
        
        // Update header progress count dynamically
        const checkedCount = document.querySelectorAll('.students-table input[type="checkbox"]:checked').length;
        document.querySelector('.progress-container').innerText = `Progress: ${checkedCount} / 75 Solved`;
    } catch(err) {
        alert("Failed to save progress");
        checkboxElem.checked = !isDone; // revert
    }
}

window.renderSubject = function(subjectId) {
    if (subjectId === 'dsa') {
        return renderDSA();
    }
    const subject = DATABASE.subjects.find(s => s.id === subjectId);
    const categoryGroups = DATABASE.topicCategories[subjectId] || [];

    let html = `
        <div class="fade-in">
            <div class="breadcrumb" onclick="renderDashboard()">Home &gt; <span>${subject.title}</span></div>
            <h2>${subject.title} Curriculum</h2>
            <p>Select a topic to master concepts, review examples, and take tests.</p>
    `;

    if (categoryGroups.length === 0) {
        html += `<p>Content coming soon...</p>`;
    } else {
        categoryGroups.forEach(group => {
            html += `<h3 style="margin-top: 2rem; color: var(--accent-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">${group.category}</h3>`;
            html += `<div class="topic-grid">`;
            
            group.topics.forEach(topic => {
                html += `
                    <div class="glass-panel topic-card" onclick="renderTopicFlow('${topic.id}', '${topic.title}')">
                        <h3>${topic.title}</h3>
                        <p style="font-size: 0.8rem;">Difficulty: ${topic.difficulty}</p>
                    </div>
                `;
            });
            html += `</div>`;
        });
    }

    html += `</div>`;
    mainContent.innerHTML = html;
}

window.renderTopicFlow = function(topicId, topicTitle) {
    const isCoreCS = topicId.endsWith('-notes');
    const contentData = DATABASE.content[topicId];
    
    let html = `
        <div class="fade-in">
            <div class="breadcrumb" onclick="renderDashboard()">Home &gt; <span>Topics</span> &gt; <span>${topicTitle}</span></div>
            
            <div class="learning-header">
                <h2>${topicTitle}</h2>
                <p>${isCoreCS ? 'Study the deep theoretical notes, then take the test.' : 'Master this topic by going through concepts, examples, and the final quiz.'}</p>
            </div>

            <div class="tabs-nav">
                <button class="tab-btn active" onclick="switchTab('concepts')">1. ${isCoreCS ? 'In-Depth Notes' : 'Core Concepts'}</button>
                ${!isCoreCS ? `<button class="tab-btn" onclick="switchTab('examples')">2. Solved Examples</button>` : ''}
                <button class="tab-btn" onclick="switchTab('exam'); initializeExamFetch('${topicId}');">${isCoreCS ? '2.' : '3.'} Practice Exam</button>
                <button class="tab-btn" onclick="switchTab('leaderboard'); fetchLeaderboard('${topicId}');">${isCoreCS ? '3.' : '4.'} Leaderboard</button>
            </div>

            <div id="tab-concepts" class="tab-content active" style="min-height: 400px;">
                ${isCoreCS ? 
                    '<div id="dynamic-notes-container"><p>Loading massive note archives from server...</p></div>' 
                    : (contentData ? contentData.concepts : '<p>Concepts scaffolding. Fill out later.</p>')
                }
            </div>

            ${!isCoreCS ? `
            <div id="tab-examples" class="tab-content">
                ${contentData ? contentData.examples : '<p>Examples scaffolding. Fill out later.</p>'}
            </div>
            ` : ''}

            <div id="tab-exam" class="tab-content" data-topic="${topicId}">
               <div id="exam-pre">
                   <p>This exam consists of 10 random questions from the database. You have 10 minutes to complete it.</p>
                   <button class="btn-primary" onclick="startExam('${topicId}')">Start Timer & Exam</button>
               </div>
               <div id="exam-active" style="display: none;">
                   <div style="text-align: right; font-size: 1.25rem; font-weight: bold; color: var(--accent-danger); margin-bottom: 1rem;">
                       Time Remaining: <span id="exam-timer">10:00</span>
                   </div>
                   <div id="quiz-container-inner"><p>Loading...</p></div>
               </div>
            </div>

            <div id="tab-leaderboard" class="tab-content">
               <div id="leaderboard-container"><p>Loading leaderboard...</p></div>
            </div>
        </div>
    `;

    mainContent.innerHTML = html;
    resetTimer();

    // Trigger progressive fetch for CS notes
    if (isCoreCS) {
        fetch(`${API_URL}/notes/${topicId}`)
            .then(res => res.json())
            .then(data => {
                const container = document.getElementById('dynamic-notes-container');
                if (container) container.innerHTML = data.html;
            })
            .catch(err => {
                const container = document.getElementById('dynamic-notes-container');
                if (container) container.innerHTML = '<p>Failed to load the deep notes from server.</p>';
            });
    }
}

window.initializeExamFetch = function(topicId) {
    // We only fetch when they hit Start, but we can do it here to preempt load. We'll do it on Start.
};

window.startExam = function(topicId) {
    document.getElementById('exam-pre').style.display = 'none';
    document.getElementById('exam-active').style.display = 'block';

    fetch(`${API_URL}/questions/${topicId}`)
        .then(res => res.json())
        .then(data => {
            if(data.length === 0) {
               document.getElementById('quiz-container-inner').innerHTML = "<p>No questions mapped for this topic yet.</p>";
               return;
            }
            window.currentExamData = data;
            document.getElementById('quiz-container-inner').innerHTML = renderExamHTML(data);
            startTimer(topicId);
        })
        .catch(err => {
            document.getElementById('quiz-container-inner').innerHTML = "<p>Error loading exam.</p>";
        });
}

function renderExamHTML(examData) {
    let html = `<div id="quiz-container">`;
    examData.forEach((q, qIndex) => {
        html += `
            <div class="question-block" data-answer="${q.answer}">
                <h4>Q${qIndex + 1}: ${q.q}</h4>
                <div class="options-list">
        `;
        q.options.forEach((opt, optIndex) => {
            html += `
                <label class="option-label">
                    <input type="radio" name="q${qIndex}" value="${optIndex}">
                    <span>${opt}</span>
                </label>
            `;
        });
        html += `</div></div>`;
    });

    html += `
        <button class="btn-primary" onclick="submitExam()">Submit Exam</button>
        </div>
        <div id="exam-result" class="exam-result"></div>
    `;
    return html;
}

window.startTimer = function(topicId) {
    resetTimer();
    let timeLeft = EXAM_TIME_LIMIT;
    const timerSpan = document.getElementById('exam-timer');
    
    currentExamTimer = setInterval(() => {
        timeLeft--;
        examTimeElapsed = EXAM_TIME_LIMIT - timeLeft;
        let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        let s = (timeLeft % 60).toString().padStart(2, '0');
        timerSpan.innerText = `${m}:${s}`;

        if (timeLeft <= 0) {
            clearInterval(currentExamTimer);
            alert("Time's up! Submitting your exam automatically.");
            submitExam();
        }
    }, 1000);
}

window.resetTimer = function() {
    if(currentExamTimer) clearInterval(currentExamTimer);
    examTimeElapsed = 0;
}

window.submitExam = async function() {
    resetTimer(); // Stop timer
    const questions = document.querySelectorAll('.question-block');
    if (questions.length === 0) return;

    let score = 0;
    let total = questions.length;
    const topicId = document.getElementById('tab-exam').getAttribute('data-topic');

    questions.forEach((qBlock, idx) => {
        const correctAns = parseInt(qBlock.getAttribute('data-answer'));
        const selected = document.querySelector(`input[name="q${idx}"]:checked`);
        if (selected && parseInt(selected.value) === correctAns) {
            score++;
        }
    });

    // Disable all inputs so user cannot change answers
    document.querySelectorAll('input[type="radio"]').forEach(inp => inp.disabled = true);
    document.querySelector('#quiz-container .btn-primary').style.display = 'none'; // hide submit button

    const resultDiv = document.getElementById('exam-result');
    resultDiv.innerHTML = `<h3>Submitting Score...</h3>`;
    resultDiv.classList.add('show');

    // Post to Leaderboard API
    try {
        await fetch(`${API_URL}/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: loggedInUser.id,
                topic_id: topicId,
                score: score,
                time_taken: examTimeElapsed
            })
        });

        resultDiv.innerHTML = `
            <h3>Exam Submitted!</h3>
            <p>You scored <strong>${score}</strong> out of <strong>${total}</strong> in ${examTimeElapsed}s.</p>
            <p>Check the leaderboard tab to see your rank!</p>
        `;
    } catch(err) {
        resultDiv.innerHTML = `<p>Exam finished, but failed to save score.</p>`;
    }
}

window.fetchLeaderboard = async function(topicId) {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '<p>Loading leaderboard...</p>';

    try {
        const res = await fetch(`${API_URL}/leaderboard/${topicId}`);
        const data = await res.json();

        let html = '';
        if(data.length === 0) {
            html = '<p>No scores submitted for this topic yet. Be the first!</p>';
        } else {
            html += `
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Student</th>
                            <th>Score</th>
                            <th>Time Taken (sec)</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.forEach((entry, idx) => {
                html += `
                    <tr>
                        <td>#${idx + 1}</td>
                        <td>${entry.name}</td>
                        <td>${entry.score}/10</td>
                        <td>${entry.time_taken}s</td>
                    </tr>
                `;
            });
            html += `</tbody></table>`;
        }
        container.innerHTML = html;
    } catch (e) {
        container.innerHTML = '<p>Failed to load leaderboard.</p>';
    }
}

window.switchTab = function(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    event.target.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// Navigation Events
dashboardBtn.addEventListener('click', () => {
    if (!loggedInUser) return renderAuth('signin');
    resetTimer(); // If they navigate away
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    dashboardBtn.classList.add('active');
    renderDashboard();
});

window.renderEnrolledStudents = async function() {
    if (!loggedInUser) return renderAuth('signin');
    resetTimer(); // If they navigate away
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.nav-btn[data-target="enrolled"]').classList.add('active');

    if (loggedInUser.role === 'teacher') return renderTeacherDashboard();

    let html = `
        <div class="fade-in">
            <h2>Enrolled Students</h2>
            <p>List of students currently preparing with PrepPortal.</p>
            <div class="glass-panel" style="margin-top: 2rem; overflow-x: auto;">
                <table class="students-table">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Enrollment Date</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    try {
        const response = await fetch(`${API_URL}/students`);
        const students = await response.json();

        if (students.length === 0) {
            html += `<tr><td colspan="4" style="text-align:center;">No students enrolled yet.</td></tr>`;
        } else {
            students.forEach(student => {
            html += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.email}</td>
                    <td>${student.enrolledDate}</td>
                </tr>
            `;
            });
        }
    } catch (err) {
        html += `<tr><td colspan="4" style="text-align:center;">Error loading students from API.</td></tr>`;
    }

    html += `
                    </tbody>
                </table>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;
}

window.renderMockBuilder = function() {
    if (!loggedInUser) return renderAuth('signin');
    resetTimer();
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.nav-btn[data-target="mock"]').classList.add('active');

    const topics = DATABASE.topicCategories['aptitude'][0].topics;

    let html = `
        <div class="fade-in">
            <h2>Mock Test Generator</h2>
            <p>Select multiple topics to generate a custom 10-question mock exam.</p>

            <div class="tabs-nav">
                <button class="tab-btn active" onclick="switchTab('mock-create')">Create Exam</button>
                <button class="tab-btn" onclick="switchTab('mock-leaderboard'); fetchLeaderboard('mock-exam-mixed');">Global Leaderboard</button>
            </div>

            <div id="tab-mock-create" class="tab-content active" style="margin-top:2rem;">
                <div class="glass-panel" id="mock-builder" style="padding: 1.5rem;">
                    <h3>Select Topics:</h3>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
    `;

    topics.forEach(t => {
        html += `
            <label class="option-label" style="padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 4px;">
                <input type="checkbox" value="${t.id}" class="mock-topic-cb">
                <span style="font-size: 0.9rem;">${t.title}</span>
            </label>
        `;
    });

    html += `
                    </div>
                    <button class="btn-primary" style="margin-top: 1.5rem;" onclick="generateMockExam()">Generate & Start Exam</button>
                </div>
                
                <div id="tab-exam" data-topic="mock-exam-mixed" style="display:none; margin-top: 2rem;">
                    <div id="exam-active">
                       <div style="text-align: right; font-size: 1.25rem; font-weight: bold; color: var(--accent-danger); margin-bottom: 1rem;">
                           Time Remaining: <span id="exam-timer">10:00</span>
                       </div>
                       <div id="quiz-container-inner"><p>Loading...</p></div>
                   </div>
                </div>
            </div>

            <div id="tab-mock-leaderboard" class="tab-content">
               <div id="leaderboard-container"><p>Loading leaderboard...</p></div>
            </div>
        </div>
    `;

    mainContent.innerHTML = html;
}

window.generateMockExam = function() {
    const checkboxes = document.querySelectorAll('.mock-topic-cb:checked');
    if(checkboxes.length === 0) {
        alert("Please select at least one topic.");
        return;
    }

    const selectedIds = Array.from(checkboxes).map(cb => cb.value).join(',');

    document.getElementById('mock-builder').style.display = 'none';
    document.getElementById('tab-exam').style.display = 'block';
    
    fetch(`${API_URL}/questions/mock?topics=${selectedIds}`)
        .then(res => res.json())
        .then(data => {
            if(data.length === 0) {
               document.getElementById('quiz-container-inner').innerHTML = "<p>No questions found for selected topics.</p>";
               return;
            }
            document.getElementById('quiz-container-inner').innerHTML = renderExamHTML(data);
            startTimer('mock-exam-mixed');
        })
        .catch(err => {
            document.getElementById('quiz-container-inner').innerHTML = "<p>Error loading Mock Exam.</p>";
        });
}

window.renderProfile = function() {
    if (!loggedInUser) return renderAuth('signin');
    resetTimer(); // If they navigate away
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.nav-btn[data-target="profile"]').classList.add('active');

    let html = `
        <div class="fade-in">
            <h2>Your Profile</h2>
            <div class="glass-panel" style="margin-top: 2rem; padding: 2rem;">
                <h3 style="margin-bottom: 1rem;">Account Details</h3>
                <p><strong>Name:</strong> ${loggedInUser.name}</p>
                <p><strong>Email:</strong> ${loggedInUser.email}</p>
                <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <button class="btn-primary" style="background: var(--accent-danger);" onclick="logout()">Logout</button>
                </div>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;
}

window.logout = function() {
    loggedInUser = null;
    resetTimer();
    document.querySelectorAll('.nav-btn, .btn-primary').forEach(btn => {
        const target = btn.getAttribute('data-target');
        if (target === 'signin' || target === 'signup') {
            btn.style.display = 'inline-block';
        } else if (target) {
            btn.style.display = 'none';
        }
    });
    renderAuth('signin');
}

window.renderAuth = function(type) {
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const isSignIn = type === 'signin';
    const title = isSignIn ? 'Sign In' : 'Create an Account';
    const btnText = isSignIn ? 'Login' : 'Sign Up';
    const switchText = isSignIn ? "Don't have an account? Sign Up" : "Already have an account? Sign In";
    const switchTarget = isSignIn ? 'signup' : 'signin';

    let html = `
        <div class="fade-in auth-container">
            <div class="glass-panel auth-card">
                <h2 style="text-align: center; margin-bottom: 2rem;">${title}</h2>
                <div id="auth-error" style="color: var(--accent-danger); margin-bottom: 1rem; text-align: center;"></div>
                <form id="auth-form" data-type="${type}" onsubmit="handleAuthSubmit(event)">
                    ${!isSignIn ? `
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="John Doe" required />
                        </div>
                    ` : ''}
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="auth-email" placeholder="you@example.com" required />
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="auth-password" placeholder="••••••••" required />
                    </div>
                    <button type="submit" class="btn-primary" style="width: 100%; margin-top: 1rem;">${btnText}</button>
                </form>
                <div style="text-align: center; margin-top: 1.5rem;">
                    <a href="#" class="auth-link" onclick="renderAuth('${switchTarget}')">${switchText}</a>
                </div>
            </div>
        </div>
    `;
    mainContent.innerHTML = html;
    
    if (isSignIn) {
        document.querySelector('.nav-btn[data-target="signin"]').classList.add('active');
    }
}

window.handleAuthSubmit = async function(e) {
    e.preventDefault();
    const type = document.getElementById('auth-form').getAttribute('data-type');
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const errorDiv = document.getElementById('auth-error');
    errorDiv.innerText = '';

    const payload = { email, password };
    
    if (type === 'signup') {
        const nameInput = document.querySelector('input[placeholder="John Doe"]');
        if (nameInput) payload.name = nameInput.value;
    }

    try {
        const route = type === 'signin' ? '/login' : '/signup';
        const res = await fetch(`${API_URL}${route}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const data = await res.json();
        
        if (!res.ok) {
            errorDiv.innerText = data.error || 'Authentication failed';
            return;
        }

        if (type === 'signup') {
            alert('Signup successful! Please sign in.');
            renderAuth('signin');
        } else {
            loggedInUser = data.user;
            document.querySelectorAll('.nav-btn, .btn-primary').forEach(btn => {
                const target = btn.getAttribute('data-target');
                if (target === 'signin' || target === 'signup') {
                    btn.style.display = 'none';
                } else if (target) {
                    btn.style.display = 'inline-block';
                }
            });
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            
            if (loggedInUser.role === 'teacher') {
                // Tailor Teacher UI
                document.querySelector('.nav-btn[data-target="dashboard"]').style.display = 'none';
                document.querySelector('.nav-btn[data-target="mock"]').style.display = 'none';
                document.querySelector('.nav-btn[data-target="profile"]').style.display = 'none';
                
                const enrolledBtn = document.querySelector('.nav-btn[data-target="enrolled"]');
                enrolledBtn.classList.add('active');
                renderTeacherDashboard();
            } else {
                dashboardBtn.classList.add('active');
                renderDashboard();
            }
        }
    } catch (err) {
        errorDiv.innerText = 'Failed to connect to server.';
    }
}

// Initial Setup
document.querySelectorAll('.nav-btn, .btn-primary').forEach(btn => {
    const target = btn.getAttribute('data-target');
    if (target && target !== 'signin' && target !== 'signup') {
        btn.style.display = 'none';
    }
});

window.toggleTheme = function() {
    const isLight = document.body.classList.toggle('light-theme');
    const themeBtn = document.getElementById('theme-btn');
    if(isLight) {
        themeBtn.innerText = '🌙';
        localStorage.setItem('theme', 'light');
    } else {
        themeBtn.innerText = '☀️';
        localStorage.setItem('theme', 'dark');
    }
}

// Check local storage for theme
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-theme');
        document.getElementById('theme-btn').innerText = '🌙';
    }
});

// -- Teacher Portal --
window.renderTeacherDashboard = async function(activeTab) {
    activeTab = activeTab || 'students';
    mainContent.innerHTML = `
        <div class="fade-in">
            <h2 style="margin-bottom:0.5rem;">Teacher Portal</h2>
            <p style="color:var(--text-secondary);margin-bottom:1.5rem;">Manage students and create custom tests.</p>
            <div class="tabs-nav" style="margin-bottom:1.5rem;">
                <button class="tab-btn ${activeTab==='students'?'active':''}" onclick="renderTeacherDashboard('students')">Students</button>
                <button class="tab-btn ${activeTab==='tests'?'active':''}" onclick="renderTeacherDashboard('tests')">My Tests</button>
                <button class="tab-btn ${activeTab==='create'?'active':''}" onclick="renderTeacherDashboard('create')">Create Test</button>
            </div>
            <div id="teacher-tab-content"><p>Loading...</p></div>
        </div>
    `;
    if (activeTab === 'students') await loadTeacherStudents();
    else if (activeTab === 'tests') await loadTeacherTests();
    else if (activeTab === 'create') buildCreateTestForm();
}

async function loadTeacherStudents() {
    const container = document.getElementById('teacher-tab-content');
    try {
        const response = await fetch(`${API_URL}/students`);
        const students = await response.json();
        if (students.length === 0) { container.innerHTML = '<div class="glass-panel"><p>No students enrolled yet.</p></div>'; return; }
        let html = `<div class="glass-panel" style="overflow-x:auto;"><table class="students-table"><thead><tr><th>#</th><th>Name</th><th>Email</th><th>Enrolled</th><th>Report</th></tr></thead><tbody>`;
        students.forEach((s, i) => {
            html += `<tr><td>${i+1}</td><td><strong>${s.name}</strong></td><td style="color:var(--text-secondary)">${s.email}</td><td style="color:var(--text-secondary)">${s.enrolledDate||'-'}</td><td><button class="btn-primary" style="padding:0.3rem 0.8rem;font-size:0.8rem;" onclick="renderStudentAnalytics(${s.id},'${s.name}')">View</button></td></tr>`;
        });
        html += '</tbody></table></div>';
        container.innerHTML = html;
    } catch(e) { container.innerHTML = '<p style="color:var(--accent-danger)">Failed to load students.</p>'; }
}

async function loadTeacherTests() {
    const container = document.getElementById('teacher-tab-content');
    try {
        const res = await fetch(`${API_URL}/teacher/tests`);
        const tests = await res.json();
        if (tests.length === 0) {
            container.innerHTML = `<div class="glass-panel" style="text-align:center;padding:3rem;"><p style="font-size:1.1rem;margin-bottom:1rem;">No tests created yet.</p><button class="btn-primary" onclick="renderTeacherDashboard('create')">+ Create Your First Test</button></div>`;
            return;
        }
        let html = '<div style="display:flex;flex-direction:column;gap:1rem;">';
        tests.forEach(t => {
            html += `<div class="glass-panel" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;"><div><h3 style="margin:0 0 0.25rem">${t.title}</h3><p style="color:var(--text-secondary);margin:0;font-size:0.85rem;">${t.description||''} Created: ${new Date(t.created_at).toLocaleDateString()}</p></div><button class="btn-primary" style="padding:0.4rem 1rem;" onclick="renderTestResults(${t.id},'${t.title}')">View Results</button></div>`;
        });
        html += '</div>';
        container.innerHTML = html;
    } catch(e) { container.innerHTML = '<p style="color:var(--accent-danger)">Failed to load tests.</p>'; }
}

function buildCreateTestForm() {
    const container = document.getElementById('teacher-tab-content');
    container.innerHTML = `
        <div class="glass-panel" style="max-width:700px;">
            <h3>Create New Test</h3>
            <div class="form-group" style="margin-top:1rem;"><label>Test Title *</label><input type="text" id="test-title" placeholder="e.g. Mid-Term Aptitude Test" /></div>
            <div class="form-group"><label>Description (optional)</label><input type="text" id="test-desc" placeholder="Brief description for students" /></div>
            <div id="questions-list" style="margin-top:1.5rem;display:flex;flex-direction:column;gap:1.5rem;"></div>
            <button class="btn-primary" style="margin-top:1rem;background:var(--accent-success);" onclick="addQuestion()">+ Add Question</button>
            <button class="btn-primary" style="margin-top:1rem;margin-left:1rem;" onclick="submitCreateTest()">Save Test</button>
            <div id="create-test-error" style="color:var(--accent-danger);margin-top:1rem;"></div>
        </div>
    `;
    window.addQuestion();
}

window.addQuestion = function() {
    const list = document.getElementById('questions-list');
    const idx = list.children.length;
    const div = document.createElement('div');
    div.className = 'glass-panel';
    div.style.cssText = 'padding:1rem;border:1px solid var(--border-color);';
    div.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;"><strong>Question ${idx+1}</strong><button onclick="this.closest('.glass-panel').remove()" style="background:none;border:none;color:var(--accent-danger);cursor:pointer;">Remove</button></div>
        <div class="form-group"><input type="text" class="q-text" placeholder="Enter the question..." /></div>
        <div style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:0.75rem;">
            <input type="text" class="q-opt" placeholder="Option A" />
            <input type="text" class="q-opt" placeholder="Option B" />
            <input type="text" class="q-opt" placeholder="Option C" />
            <input type="text" class="q-opt" placeholder="Option D" />
        </div>
        <div class="form-group"><label style="font-size:0.85rem;">Correct Answer</label>
            <select class="q-correct"><option value="0">Option A</option><option value="1">Option B</option><option value="2">Option C</option><option value="3">Option D</option></select>
        </div>
    `;
    list.appendChild(div);
}

window.submitCreateTest = async function() {
    const title = document.getElementById('test-title').value.trim();
    const desc = document.getElementById('test-desc').value.trim();
    const errorDiv = document.getElementById('create-test-error');
    errorDiv.innerText = '';
    if (!title) { errorDiv.innerText = 'Please enter a test title.'; return; }
    const questionBlocks = document.querySelectorAll('#questions-list .glass-panel');
    if (questionBlocks.length === 0) { errorDiv.innerText = 'Add at least one question.'; return; }
    const questions = [];
    let valid = true;
    questionBlocks.forEach((block, i) => {
        const qText = block.querySelector('.q-text').value.trim();
        const opts = [...block.querySelectorAll('.q-opt')].map(o => o.value.trim());
        const correctIdx = parseInt(block.querySelector('.q-correct').value);
        if (!qText || opts.some(o => !o)) { errorDiv.innerText = 'Fill all fields in Question ' + (i+1) + '.'; valid = false; }
        questions.push({ question_text: qText, options: opts, correct_index: correctIdx });
    });
    if (!valid) return;
    try {
        const res = await fetch(`${API_URL}/teacher/tests`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({title, description:desc, questions}) });
        if (!res.ok) throw new Error();
        alert('Test created! Students can now take it.');
        renderTeacherDashboard('tests');
    } catch(e) { errorDiv.innerText = 'Failed to save test.'; }
}

window.renderTestResults = async function(testId, testTitle) {
    mainContent.innerHTML = '<div class="fade-in"><p>Loading results...</p></div>';
    try {
        const res = await fetch(`${API_URL}/teacher/tests/${testId}/results`);
        const results = await res.json();
        let html = `<p style="cursor:pointer;color:var(--accent-primary);margin-bottom:1rem;" onclick="renderTeacherDashboard('tests')">Back to My Tests</p><h2>Results: ${testTitle}</h2>`;
        if (results.length === 0) {
            html += '<div class="glass-panel" style="text-align:center;padding:3rem;"><p>No students have taken this test yet.</p></div>';
        } else {
            html += `<div class="glass-panel" style="overflow-x:auto;margin-top:1.5rem;"><table class="students-table"><thead><tr><th>Rank</th><th>Name</th><th>Email</th><th>Score</th><th>Time</th><th>Submitted</th></tr></thead><tbody>`;
            results.forEach((r, i) => {
                const pct = Math.round((r.score/r.total)*100);
                const col = pct>=70?'var(--accent-success)':pct>=40?'var(--accent-primary)':'var(--accent-danger)';
                html += `<tr><td><strong>#${i+1}</strong></td><td>${r.name}</td><td style="color:var(--text-secondary)">${r.email}</td><td><span style="color:${col};font-weight:bold;">${r.score}/${r.total} (${pct}%)</span></td><td>${r.time_taken}s</td><td style="color:var(--text-secondary);font-size:0.8rem;">${new Date(r.submitted_at).toLocaleString()}</td></tr>`;
            });
            html += '</tbody></table></div>';
        }
        mainContent.innerHTML = `<div class="fade-in">${html}</div>`;
    } catch(e) { mainContent.innerHTML = '<div class="fade-in"><h2>Failed to load results.</h2></div>'; }
}

window.renderStudentTests = async function() {
    if (!loggedInUser) return renderAuth('signin');
    mainContent.innerHTML = `
        <div class="fade-in">
            <div class="breadcrumb" onclick="renderDashboard()">Home &gt; <span>Teacher Tests</span></div>
            <h2>Teacher-Assigned Tests</h2>
            <p style="color:var(--text-secondary);">Tests created by your teacher.</p>
            <div id="student-tests-list" style="margin-top:1.5rem;display:flex;flex-direction:column;gap:1rem;"><p>Loading...</p></div>
        </div>
    `;
    try {
        const res = await fetch(`${API_URL}/teacher/tests`);
        const tests = await res.json();
        const container = document.getElementById('student-tests-list');
        if (tests.length === 0) { container.innerHTML = '<div class="glass-panel"><p>No tests available yet.</p></div>'; return; }
        let html = '';
        tests.forEach(t => {
            html += `<div class="glass-panel" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;"><div><h3 style="margin:0 0 0.25rem">${t.title}</h3><p style="color:var(--text-secondary);margin:0;font-size:0.85rem;">${t.description||''}</p></div><button class="btn-primary" style="padding:0.4rem 1.2rem;" onclick="takeTeacherTest(${t.id})">Start Test</button></div>`;
        });
        container.innerHTML = html;
    } catch(e) { document.getElementById('student-tests-list').innerHTML = '<p style="color:var(--accent-danger)">Failed to load tests.</p>'; }
}

window.takeTeacherTest = async function(testId) {
    mainContent.innerHTML = '<div class="fade-in"><h2>Loading test...</h2></div>';
    try {
        const res = await fetch(`${API_URL}/teacher/tests/${testId}`);
        const test = await res.json();
        window._teacherTestStartTime = Date.now();
        let html = `<div class="fade-in"><div class="breadcrumb" onclick="renderStudentTests()">Teacher Tests &gt; <span>${test.title}</span></div><h2>${test.title}</h2>${test.description?`<p style="color:var(--text-secondary)">${test.description}</p>`:''}<div id="teacher-quiz-container" style="margin-top:1.5rem;">`;
        test.questions.forEach((q, i) => {
            html += `<div class="glass-panel question-block" style="margin-bottom:1rem;" data-answer="${q.correct_index}"><h4>Q${i+1}: ${q.question_text}</h4><div class="options-list">`;
            q.options.forEach((opt, j) => { html += `<label class="option-label"><input type="radio" name="tq${i}" value="${j}"><span>${opt}</span></label>`; });
            html += '</div></div>';
        });
        html += `</div><button class="btn-primary" style="margin-top:1rem;" onclick="submitTeacherTest(${testId},${test.questions.length})">Submit Test</button><div id="teacher-test-error" style="color:var(--accent-danger);margin-top:0.5rem;"></div></div>`;
        mainContent.innerHTML = html;
    } catch(e) { mainContent.innerHTML = '<div class="fade-in"><h2>Failed to load test.</h2></div>'; }
}

window.submitTeacherTest = async function(testId, total) {
    const blocks = document.querySelectorAll('#teacher-quiz-container .question-block');
    let score = 0; let allAnswered = true;
    blocks.forEach((block, i) => {
        const sel = block.querySelector('input[name="tq' + i + '"]:checked');
        if (!sel) { allAnswered = false; return; }
        if (parseInt(sel.value) === parseInt(block.dataset.answer)) score++;
    });
    if (!allAnswered) { document.getElementById('teacher-test-error').innerText = 'Please answer all questions.'; return; }
    const timeTaken = Math.round((Date.now() - window._teacherTestStartTime) / 1000);
    try {
        await fetch(`${API_URL}/teacher/tests/${testId}/submit`, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ user_id:loggedInUser.id, score, total, time_taken:timeTaken }) });
        mainContent.innerHTML = `<div class="fade-in" style="text-align:center;padding:4rem 2rem;"><div style="font-size:4rem;margin-bottom:1rem;">${score>=total*0.7?'🎉':score>=total*0.4?'👍':'💪'}</div><h2>Test Submitted!</h2><div class="glass-panel" style="display:inline-block;padding:2rem 3rem;margin-top:1.5rem;"><p style="font-size:1.5rem;margin:0;">Score: <strong style="color:var(--accent-primary)">${score} / ${total}</strong></p><p style="color:var(--text-secondary);margin:0.5rem 0 0">Time: ${timeTaken}s</p></div><br><button class="btn-primary" style="margin-top:1.5rem;" onclick="renderStudentTests()">Back to Tests</button></div>`;
    } catch(e) { document.getElementById('teacher-test-error').innerText = 'Failed to submit. Please try again.'; }
}

window.renderStudentAnalytics = async function(studentId, studentName) {
    mainContent.innerHTML = '<div class="fade-in"><h2>Loading Data for ' + studentName + '...</h2></div>';
    
    try {
        const response = await fetch(`${API_URL}/teacher/student/${studentId}/analytics`);
        const analytics = await response.json();

        let aptitudeScore = 0;
        let coreCsScore = 0;
        let mockScore = 0;

        // Categorize Activities
        analytics.leaderboard.forEach(entry => {
            if (entry.topic_id === 'mock-exam-mixed') mockScore++;
            else if (entry.topic_id.endsWith('-notes')) coreCsScore++;
            else aptitudeScore++;
        });

        const dsaScore = analytics.dsa_completed;

        let html = `
            <div class="fade-in" style="max-width: 900px; margin: 0 auto;">
                <div class="breadcrumb" onclick="renderTeacherDashboard()">Teacher Dashboard &gt; <span>${studentName}</span></div>
                <h2>${studentName}'s Report Card</h2>
                
                <div style="display: flex; gap: 2rem; margin-top: 2rem; flex-wrap: wrap;">
                    <div class="glass-panel" style="flex: 1; min-width: 300px;">
                        <h3 style="text-align: center; margin-bottom: 1rem;">Activity Distribution</h3>
                        <canvas id="activityChart"></canvas>
                    </div>
                    
                    <div class="glass-panel" id="drilldown-panel" style="flex: 1; min-width: 300px; text-align: center; display: flex; flex-direction: column; justify-content: center;">
                        <h3 style="color: var(--text-secondary);">Click on a Pie Chart slice to expand performance details.</h3>
                    </div>
                </div>
            </div>
        `;
        mainContent.innerHTML = html;

        const ctx = document.getElementById('activityChart').getContext('2d');
        const activityChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Aptitude', 'DSA', 'Core CS Fundamentals', 'Mock Exams'],
                datasets: [{
                    data: [aptitudeScore, dsaScore, coreCsScore, mockScore],
                    backgroundColor: ['#06b6d4', '#10b981', '#6366f1', '#f59e0b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: localStorage.getItem('theme') === 'light' ? '#1e1e24' : '#f8f8f2' }
                    }
                },
                onClick: (event, elements) => {
                    if (elements.length > 0) {
                        const idx = elements[0].index;
                        const label = activityChart.data.labels[idx];
                        renderDrilldown(label, analytics);
                    }
                }
            }
        });

    } catch (e) {
        mainContent.innerHTML = '<div class="fade-in"><h2>Failed to load analytics.</h2></div>';
    }
}

function renderDrilldown(category, analytics) {
    const defaultColor = 'var(--text-primary)';
    const headerColor = 'var(--accent-primary)';
    
    let drillHtml = `<h3 style="color: ${headerColor}; text-align: left; margin-bottom: 1rem;">${category} Details</h3>`;
    
    if (category === 'Aptitude') {
        const aptData = analytics.leaderboard.filter(e => !e.topic_id.endsWith('-notes') && e.topic_id !== 'mock-exam-mixed');
        if (aptData.length === 0) drillHtml += '<p style="text-align: left;">No Apertitude exams taken.</p>';
        else {
            drillHtml += `<table class="students-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Score</th><th>Time</th></tr></thead><tbody>`;
            aptData.forEach(e => { drillHtml += `<tr><td>${e.topic_id}</td><td>${e.score}/10</td><td>${e.time_taken}s</td></tr>`; });
            drillHtml += `</tbody></table>`;
        }
    } else if (category === 'DSA') {
        const dsaData = analytics.dsa_questions;
        if (dsaData.length === 0) drillHtml += '<p style="text-align: left;">No DSA questions completed.</p>';
        else {
            drillHtml += `<table class="students-table" style="font-size: 0.9rem;"><thead><tr><th>Solved Question ID</th></tr></thead><tbody>`;
            dsaData.forEach(q => { drillHtml += `<tr><td>${q}</td></tr>`; });
            drillHtml += `</tbody></table><p style="text-align: left; margin-top: 1rem;">Total Solved: <strong>${analytics.dsa_completed} / 75</strong></p>`;
        }
    } else if (category === 'Core CS Fundamentals') {
        const csData = analytics.leaderboard.filter(e => e.topic_id.endsWith('-notes'));
        if (csData.length === 0) drillHtml += '<p style="text-align: left;">No CS exams taken.</p>';
        else {
            drillHtml += `<table class="students-table" style="font-size: 0.9rem;"><thead><tr><th>Topic</th><th>Score</th></tr></thead><tbody>`;
            csData.forEach(e => { drillHtml += `<tr><td>${e.topic_id.replace('-notes', '')}</td><td>${e.score}/10</td></tr>`; });
            drillHtml += `</tbody></table>`;
        }
    } else if (category === 'Mock Exams') {
        const mockData = analytics.leaderboard.filter(e => e.topic_id === 'mock-exam-mixed');
        if (mockData.length === 0) drillHtml += '<p style="text-align: left;">No Mock Exams taken.</p>';
        else {
            drillHtml += `<table class="students-table" style="font-size: 0.9rem;"><thead><tr><th>Mock Test</th><th>Score</th><th>Time</th></tr></thead><tbody>`;
            mockData.forEach((e, idx) => { drillHtml += `<tr><td>Attempt ${mockData.length - idx}</td><td>${e.score}/10</td><td>${e.time_taken}s</td></tr>`; });
            drillHtml += `</tbody></table>`;
        }
    }
    
    document.getElementById('drilldown-panel').innerHTML = drillHtml;
    // Highlight effect
    document.getElementById('drilldown-panel').style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4)';
    setTimeout(() => { document.getElementById('drilldown-panel').style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)'; }, 500);
}

renderAuth('signin');

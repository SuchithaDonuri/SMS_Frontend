from student_features import Student_features
from teacher_features import TeacherFeatures


class User:

    def __init__(self,user_id,password,role):
        self.user_id=user_id
        self.password=password
        self.role=role


    def verify_login(self,entered_id,entered_pwd):

        # checking with userinput and our object data

        return self.user_id == entered_id and self.password == entered_pwd

class Principal(User):

    def __init__(self, user_id, password):
        #role must always be "principal"
        super().__init__(user_id, password, "principal") # assigning the value principal to the role beacuse it is fixed for principal class
        # Student_features.__init__(self)
        # TeacherFeatures.__init__(self)


    #Creating an object, Storing it inside another object (Principal),Principal has a Student_features
        self.student_features=Student_features()
        self.teacher_features=TeacherFeatures()
    def dashboard(self):
        print("""
                Principal Dashboard
                1 View Student Timetable
                2 View Student Marks
                3 View Attendance
                4 View Remarks
                5 View Teacher Timetable
                6 Logout
                """)


class Teacher(User):

    def __init__(self, user_id, password,teacher_type,name,subject):
        super().__init__(user_id, password, "teacher")
        self.teacher_type=teacher_type
        self.name=name
        self.subject=subject
        

    def dashboard(self):
        if self.teacher_type=="teaching":

            print(f"""
    Welcome {self.name} ({self.subject} Teacher)
    Teacher Dashboard
    1 View Timetable
    2 Update Timetable
    3 Delete Timetable
    4 Mark Attendance
    5 Update Marks
    6 Update Remarks
    7 Logout
    """)
        else:
            print(f"""
Welcome {self.name} (Non-Teaching Staff)
1 View Timetable
2 Update Timetable
3 Delete Timetable
4 Logout
""")


class Student(User):

    def __init__(self, user_id,student_class,section,name):
        super().__init__(user_id, None, "student")
        self.student_class=student_class
        self.section=section
        self.name=name

    def get_class_section_key(self):
        return f"{self.student_class}_{self.section}"

    def dashboard(self):

        print("""\nStudent Dashboard
            1 View Timetable
            2 View Marks
            3 View Attendance
            4 View Remarks
            5 Logout""")


class Parent(User):

    def __init__(self, user_id, password,child_id):
        super().__init__(user_id, password, "parent")
        self.student_features=Student_features()
        
        self.child_id=child_id


    def dashboard(self):
        print("""Parent Dashboard
            1 View child marks
            2 View child attendance
            3 View child Remarks
            4 Logout""")

    





    







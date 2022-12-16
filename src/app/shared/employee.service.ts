import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private firebase: AngularFireDatabase) { }

  employeeList: AngularFireList<any>;

  form: FormGroup = new FormGroup({

    $key: new FormControl(null),
    payeeName: new FormControl('', Validators.required),
    ein: new FormControl('', [Validators.required, Validators.maxLength(10), Validators.minLength(10)]),
    radVendor: new FormControl(0),
    payeeCategory: new FormControl(0),
    payeeSpeciality: new FormControl(0),
    astatus: new FormControl(0),
    pStatus: new FormControl(0),
    gender: new FormControl('1'),
    department: new FormControl(0),
    hireDate: new FormControl(''),
    isPermanent: new FormControl(false)
  });

  initializeFormGroup(){

    this.form.setValue({
      $key: null,
      payeeName: '',
      ein: '',
      radVendor: 0,
      payeeCategory: 0,
      payeeSpeciality: 0,
      astatus: 0,
      pStatus: 0,
      gender: '1',
      department: 0,
      hireDate: '',
      isPermanent: false
    });
  }

  getEmployees() {

      this.employeeList = this.firebase.list('employees');
      return this.employeeList.snapshotChanges();
  }

  insertEmployee(employee) {

    this.employeeList.push({

      payeeName: employee.payeeName,
      ein: employee.ein,
      radVendor: employee.radVendor,
      payeeCategory: employee.payeeCategory,
      payeeSpeciality: employee.payeeSpeciality,
      astatus: employee.astatus,
      pStatus: employee.pStatus,
      gender: employee.gender,
      department: employee.department,
      hireDate: employee.hireDate,
      isPermanent: employee.isPermanent
    });
  }

  updateEmployee(employee) {

    this.employeeList.update(employee.$key,
      {
        payeeName: employee.payeeName,
        ein: employee.ein,
        radVendor: employee.radVendor,
        payeeCategory: employee.payeeCategory,
        payeeSpeciality: employee.payeeSpeciality,
        astatus: employee.astatus,
        pStatus: employee.pStatus,
        gender: employee.gender,
        department: employee.department,
        hireDate: employee.hireDate,
        isPermanent: employee.isPermanent
      });
  }

  deleteEmployee($key: string) {

    this.employeeList.remove($key);
  }

  populateForm(employee) {

    this.form.setValue(_.omit(employee, 'departmentName'));
  }
}
